import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
import AudioDetail from './components/AudioDetail';
import AudioList from './components/AudioList';
import AudioBankLogo from './audiobanklogo.png';
import * as Webcam from 'react-webcam';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import SearchByTag from './components/SearchByTag';
import Button from '@material-ui/core/Button';
import LiveHelpIcon from '@material-ui/icons/LiveHelpSharp';
import Switch from '@material-ui/core/Switch';
import FBLogin from './components/FBLogin'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { Transition } from 'react-transition-group';


const chatBotTheme = {
	background: '#f5f8fb',
	fontFamily: "Lucida Console",
	headerBgColor: '#3f51b5',
	headerFontColor: '#fff',
	headerFontSize: '15px',
	botBubbleColor: '#3f51b5',
	botFontColor: '#fff',
	userBubbleColor: '#fff',
	userFontColor: '#000000',
  };
  const chatBotLightTheme = {
	background: '#f5f8fb',
	fontFamily: "Lucida Console",
	headerBgColor: '#0077ff',
	headerFontColor: '#fff',
	headerFontSize: '15px',
	botBubbleColor: '#0077ff',
	botFontColor: '#fff',
	userBubbleColor: '#fff',
	userFontColor: '#000000',
  };
  const chatSteps=[
	{
		id: '1',
		message: 'What do you need help with?',
		trigger: '2',
	},
	{
		id: '2',
		options: [
		{ value: 1, label: 'What is this website for?', trigger: '4' },
		{ value: 2, label: 'How do I upload?', trigger: '3' },
		{ value: 3, label: 'How do I download a file?', trigger: '5' },
		{ value: 4, label: 'I can\'t use the Edit or Delete buttons', trigger: '10' },
		{ value: 5, label: 'That will be all, thank you', trigger: '13' },

		],
	},
	{
		id: '3',
		message: 'Press the "Add Audio" button at the top right of the page and fill in the required fields.',
		trigger: '8',
	},
	{
		id: '4',
		message: 'This app is made for the submission for MSA 2018',
		trigger: '12',
	},
	{
		id: '5',
		message: 'After selecting a file from the table on the right, press the 3 dots in the audio player to download',
		trigger: '12',
	},
	{
		id: '6',
		message: 'Don\'t worry, you can change that after you have submitted but only if you have signed in to the page',
		trigger: '9'
	},
	{
		id: '7',
		message: 'After selecting a file from the table on the right, press the "Edit" button to change the Title or Tag of the file',
		trigger: '12',
	},
	{
		id:'8',
		options: [
			{ value: 1, label: 'I entered wrong information!', trigger: '6' },
			{ value: 2, label: 'Thank you', trigger: '11' },
		],
	},
	{
		id:'9',
		options: [
			{ value: 1, label: 'How do I do that?', trigger: '7' },
			{ value: 2, label: 'Thank you', trigger: '11' },
		],
	},
	{
		id: '10',
		message: 'That means you have not logged in. Please use the button at the top left to log in.',
		trigger: '12',
	},
	{
		id: '11',
		message: 'You\t welcome!',
		trigger: '12',
	},
	{
		id: '12',
		message: 'Is there anything else I can help you with?',
		trigger: '2',
	},
	{
		id: '13',
		message: 'Goodbye',
		end: true,
	},
	

]

interface IState {
	currentAudio: any,
	audio: any[],
	openUpload: boolean,
	uploadFileList: any,
	authenticated: boolean,
	refCamera: any,
	predictionResult: any,
	chatOpen: boolean,
	loginOpen: boolean,
	isDark: boolean,
	cameraLoginFail: boolean,
	uploading: boolean,
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			currentAudio: {"id":0, "title":"Loading ","url":"","tags":"⚆ _ ⚆","uploaded":"","width":"0","height":"0"},
			audio: [],
			openUpload: false,
			uploadFileList: null,
			authenticated: false,
			refCamera: React.createRef(),
			predictionResult: null,
			chatOpen: false,
			loginOpen: false,
			isDark: false,
			cameraLoginFail: false,
			uploading: false,
		}     
		
		this.fetchAudio("")
		this.selectNewAudio = this.selectNewAudio.bind(this)
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.fetchAudio = this.fetchAudio.bind(this)
		this.uploadAudio = this.uploadAudio.bind(this)
		this.authenticate = this.authenticate.bind(this)
		this.skipAuthenticate = this.skipAuthenticate.bind(this)
		this.onLoginCloseModal = this.onLoginCloseModal.bind(this)
		this.changeTheme = this.changeTheme.bind(this)
	
	}

	private changeTheme() {
        this.setState({
            isDark: !(this.state.isDark)
        })
	}
	

	public render() {
		const { openUpload, chatOpen, loginOpen, authenticated, } = this.state;
		if(this.state.isDark){
			return (
			<div className="main-page-dark">
				<div className="header-wrapper">
					
					<div className="container header">
						<div className="theme-switch">
							<Switch
								checked={this.state.isDark}
								onChange={this.changeTheme}
								value="isDark"
								color="primary"
							/>
						</div>
						<div className="title-container">
							<img src={AudioBankLogo} height='40'/>&nbsp; MSA Phase 2 Audio Bank &nbsp; 
							{(!authenticated) ?
							<Button className="btn btn-primary btn-action btn-add" id="loginButton" variant ="contained" color="primary" onClick= {this.onLoginOpenModal}>Login</Button>
							: ""}
							{(authenticated) ?
							<Button className="btn btn-primary btn-action btn-add" id="loginButton" variant ="contained" color="primary" onClick= {this.logOut}>Log Out</Button>
							: ""}
							<Button  size="small" color="primary" onClick={this.logIn}>Dev</Button>
								{/* This button is to authenticate the marker without having to use fb or camera */}
						</div>
						<SearchByTag searchByTag={this.fetchAudio} isDark = {this.state.isDark} />
						<Button className="btn btn-primary btn-action btn-add" id="searchButton" variant="contained" color="primary" onClick={this.onOpenModal}>Add Audio</Button>
					</div>
				</div>
				<div className="container">
					<div className="row">
							<AudioList audio={this.state.audio} selectNewAudio={this.selectNewAudio} />
							<div className="chatbot-container">
							{chatOpen &&
								<ThemeProvider theme={chatBotTheme}>
								<ChatBot botDelay='400'
									steps={chatSteps}
								/>
								</ThemeProvider>
							}
							</div>
						
					</div>
				</div>
				<div className = "footer">
					<div className="botButton">
					<Button className="botButton" variant="fab" onClick={this.toggleChatModal} color="primary"><LiveHelpIcon /></Button>&nbsp;
					</div>
					<div className="footerInfo">
					<AudioDetail currentAudio={this.state.currentAudio} authenticated = {this.state.authenticated} isDark={this.state.isDark} />
					</div>
					
				</div>
				<Modal open={openUpload} onClose={this.onCloseModal}>
					<form>
						<div className="form-group">
							<label>Audio Title</label>
							<input type="text" className="form-control" id="audio-title-input" placeholder="Enter Title" />
							<small className="form-text text-muted">You can edit any audio later</small>
						</div>
						<div className="form-group">
							<label>Tag</label>
							<input type="text" className="form-control" id="audio-tag-input" placeholder="Enter Tag" />
							<small className="form-text text-muted">Tag is used for search</small>
						</div>
						<div className="form-group">
							<label>Audio</label>
							<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="audio-image-input" />
						</div>

						<Button variant="contained" color="primary" type="button" className="btn" onClick={this.uploadAudio}>Upload</Button>
					</form>
				</Modal>
				{/* <Modal open={chatOpen} onClose={this.onCloseChatModal}>
				<div>
								<ThemeProvider theme={chatBotTheme}>
								<ChatBot botDelay='400'
									steps={chatSteps}
								/>
								</ThemeProvider>
				</div>
				</Modal> */}
				<Modal open={loginOpen} onClose={this.onLoginCloseModal} closeOnOverlayClick={false} showCloseIcon={false} center={true}>
					<Webcam
						audio={false}
						screenshotFormat="image/jpeg"
						ref={this.state.refCamera}
					/>
					<div className="nav-row">
					<div className="login-button-container">
							<Button className="btn btn-primary bottom-button" variant="contained" color="primary" onClick={this.authenticate}>Login</Button> &nbsp;
							<Button className="btn btn-primary bottom-button" variant="contained" color="primary" onClick={this.skipAuthenticate}>Skip For Now</Button>
							</div>&nbsp;
							<div className="fb-login-button-container">
							<FBLogin callBack={this.fbAuthenticated}/>
							</div>
					</div>
				</Modal>
				<div>
					<Dialog
						open={this.state.cameraLoginFail}
						TransitionComponent={Transition}
						onClose={this.loginAlertClose}
						aria-labelledby="alert-dialog-slide-title"
						aria-describedby="alert-dialog-slide-description">
						<DialogTitle id="alert-dialog-slide-title">{"Facial Recognition Failed"} </DialogTitle>
						<DialogContent>
						<DialogContentText id="alert-dialog-slide-description">
						Sorry, the facial authentication system does not recognise you.
						</DialogContentText>
						</DialogContent>
						<DialogActions>
						<Button onClick={this.loginAlertClose} color="primary"> OK </Button>
						</DialogActions>
					</Dialog>
                </div>
				<div>
					<Dialog
						open={this.state.uploading}
						TransitionComponent={Transition}
						aria-labelledby="alert-dialog-slide-title"
						aria-describedby="alert-dialog-slide-description">
						<DialogTitle id="alert-dialog-slide-title">{"Uploading"} </DialogTitle>
						<DialogContent>
						<DialogContentText id="alert-dialog-slide-description">
						The page will refresh after uploading is completed
						</DialogContentText>
						</DialogContent>
						<DialogActions>
						</DialogActions>
					</Dialog>
                </div>
			</div>
			);
		} else {
			return (
				<div className="main-page-light">
					<div className="header-wrapper-light">
						<div className="container header">
							<div className="theme-switch">
								<Switch
									// checked={this.state.isDark}
									onChange={this.changeTheme}
									value="isDark"
									color="primary"
								/>
							</div>
							<div className="title-container">
								<img src={AudioBankLogo} height='40'/>&nbsp; MSA Phase 2 Audio Bank &nbsp; 
								{(!authenticated) ?
								<Button className="btn btn-primary btn-action btn-add" id="loginButton" variant ="contained" color="default" onClick= {this.onLoginOpenModal}>Login</Button>
								: ""}
								{(authenticated) ?
								<Button className="btn btn-primary btn-action btn-add" id="loginButton" variant ="contained" color="default" onClick= {this.logOut}>Log Out</Button>
								: ""}
								<Button  size="small" color="primary" onClick={this.logIn}>Dev</Button>
								{/* This button is to authenticate the marker without having to use fb or camera */}

							</div>
							<SearchByTag searchByTag={this.fetchAudio} isDark = {this.state.isDark} />
							<Button className="btn btn-primary btn-action btn-add" id="searchButton" variant="contained" color="default" onClick={this.onOpenModal}>Add Audio</Button>
						</div>
					</div>
					<div className="container">
						<div className="row">
								<AudioList audio={this.state.audio} selectNewAudio={this.selectNewAudio} />
								<div className="chatbot-container">
								{chatOpen &&
									<ThemeProvider theme={chatBotLightTheme}>
									<ChatBot botDelay='400'
										steps={chatSteps}
									/>
									</ThemeProvider>
								}
							</div>
						</div>
					</div>
					<div className = "footer-light">
						<div className="botButton">
						<Button className="botButton" variant="fab" onClick={this.toggleChatModal} color="default"><LiveHelpIcon /></Button>&nbsp;
						</div>
						<div className="footerInfo">
						<AudioDetail currentAudio={this.state.currentAudio} authenticated = {this.state.authenticated} isDark={this.state.isDark}/>
						</div>
						
					</div>
					<Modal open={openUpload} onClose={this.onCloseModal}>
						<form>
							<div className="form-group">
								<label>Audio Title</label>
								<input type="text" className="form-control" id="audio-title-input" placeholder="Enter Title" />
								<small className="form-text text-muted">You can edit any audio later</small>
							</div>
							<div className="form-group">
								<label>Tag</label>
								<input type="text" className="form-control" id="audio-tag-input" placeholder="Enter Tag" />
								<small className="form-text text-muted">Tag is used for search</small>
							</div>
							<div className="form-group">
								<label>Audio</label>
								<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="audio-image-input" />
							</div>
	
							<Button variant="contained" color="primary" type="button" className="btn" onClick={this.uploadAudio}>Upload</Button>
						</form>
					</Modal>
					{/* <Modal open={chatOpen} onClose={this.onCloseChatModal}>
					<div>
									<ThemeProvider theme={chatBotLightTheme}>
									<ChatBot botDelay='400'
										steps={chatSteps}
									/>
									</ThemeProvider>
					</div>
					</Modal> */}
					<Modal open={loginOpen} onClose={this.onLoginCloseModal} closeOnOverlayClick={false} showCloseIcon={false} center={true}>
						<Webcam
							audio={false}
							screenshotFormat="image/jpeg"
							ref={this.state.refCamera}
						/>
						<div className="nav-row">
							<div className="login-button-container">
							<Button className="btn btn-primary bottom-button" variant="contained" color="primary" onClick={this.authenticate}>Login</Button> &nbsp;
							<Button className="btn btn-primary bottom-button" variant="contained" color="primary" onClick={this.skipAuthenticate}>Skip For Now</Button>
							</div>&nbsp;
							<div className="fb-login-button-container">
							<FBLogin callBack={this.fbAuthenticated}/>
							</div>
						</div>
					</Modal>
					<div>
						<Dialog
							open={this.state.cameraLoginFail}
							TransitionComponent={Transition}
							onClose={this.loginAlertClose}
							aria-labelledby="alert-dialog-slide-title"
							aria-describedby="alert-dialog-slide-description">
							<DialogTitle id="alert-dialog-slide-title">{"Facial Recognition Failed"} </DialogTitle>
							<DialogContent>
							<DialogContentText id="alert-dialog-slide-description">
							Sorry, the facial authentication system does not recognise you.
							</DialogContentText>
							</DialogContent>
							<DialogActions>
							<Button onClick={this.loginAlertClose} color="primary"> OK </Button>
							</DialogActions>
						</Dialog>
					</div>
					<div>
					<Dialog
						open={this.state.uploading}
						TransitionComponent={Transition}
					
						aria-labelledby="alert-dialog-slide-title"
						aria-describedby="alert-dialog-slide-description">
						<DialogTitle id="alert-dialog-slide-title">{"Uploading"} </DialogTitle>
						<DialogContent>
						<DialogContentText id="alert-dialog-slide-description">
						The page will refresh after uploading is completed
						</DialogContentText>
						</DialogContent>
						<DialogActions>
						
						</DialogActions>
					</Dialog>
                </div>
				</div>
				);
		}
	}

	public fbAuthenticated =(response: any) => {
		if(!(response.status == "unknown")) {
			this.setState({authenticated: true});
			this.setState({loginOpen: false});
		}
	}
	private toggleChatModal =() => {
		this.setState({chatOpen: !(this.state.chatOpen)})
	}

	private logOut =() => {
		this.setState({authenticated: false});
	}

	private logIn =() => {
		this.setState({authenticated: true});
	}

	// Modal open
	private onOpenModal = () => {
		this.setState({ openUpload: true });
	  };
	
	// Modal close
	private onCloseModal = () => {
		this.setState({ openUpload: false });
	};

	// Modal close
	private onLoginCloseModal = () => {
		this.setState({ loginOpen: false });
	};
	private onLoginOpenModal = () => {
		this.setState({ loginOpen: true });
	};
	
	// Change selected audio
	private selectNewAudio(newAudio: any) {
		this.setState({
			currentAudio: newAudio
		})
	}

	// GET audio
	private fetchAudio(tag: any) {
		let url = "https://msaaudiobankapi.azurewebsites.net/api/Audio"
		if (tag !== "") {
			url += "/tag?tag=" + tag
		}
        fetch(url, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(json => {
			let currentAudio = json[0]
			if (currentAudio === undefined) {
				currentAudio = {"id":0, "title":"No audio found","url":"","tags":"","uploaded":""}
			}
			this.setState({
				currentAudio,
				audio: json
			})
        });
	}

	// Sets file list
	private handleFileUpload(fileList: any) {
		this.setState({
			uploadFileList: fileList.target.files
		})
	}

	// POST audio
	private uploadAudio() {
		this.setState({
			uploading: true
		})
		const titleInput = document.getElementById("audio-title-input") as HTMLInputElement
		const tagInput = document.getElementById("audio-tag-input") as HTMLInputElement
		const audioFile = this.state.uploadFileList[0]

		if (titleInput === null || tagInput === null || audioFile === null) {
			return;
		}

		const title = titleInput.value
		const tag = tagInput.value
		const url = "https://msaaudiobankapi.azurewebsites.net/api/Audio/upload"

		const formData = new FormData()
		formData.append("Title", title)
		formData.append("Tags", tag)
		formData.append("Audio", audioFile)

		fetch(url, {
			body: formData,
			headers: {'cache-control': 'no-cache'},
			method: 'POST'
		})
        .then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText)
			} else {
				this.setState({
					uploading: false,
				})
				location.reload();
			}
		  })
	}

	// Authenticate
	private authenticate() {
		const screenshot = this.state.refCamera.current.getScreenshot();
		this.getFaceRecognitionResult(screenshot);
		
	}

	
	private skipAuthenticate(){
		this.setState({ loginOpen: false });
	}

	// Call custom vision model
	private getFaceRecognitionResult(image: string) {
		const url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/7a18675e-0af6-409f-972e-91422b9f58ab/image"
		if (image === null) {
			return;
		}
		const base64 = require('base64-js');
		const base64content = image.split(";")[1].split(",")[1]
		const byteArray = base64.toByteArray(base64content);
		fetch(url, {
			body: byteArray,
			headers: {
				'cache-control': 'no-cache', 'Prediction-Key': '24eaf03113534d908d72e14e7d743e5a', 'Content-Type': 'application/octet-stream'
			},
			method: 'POST'
		})	
			.then((response: any) => {
				if (!response.ok) {
					// Error State
					alert(response.statusText)
				} else {
					response.json().then((json: any) => {
						console.log(json.predictions[0])
						this.setState({predictionResult: json.predictions[0] })
						if (this.state.predictionResult.probability > 0.7) {
							this.setState({authenticated: true})
							this.setState({ loginOpen: false });
						} else {
							this.setState({authenticated: false,
							cameraLoginFail: true})
							
						}
					})
					
				}
			})
	}

	private loginAlertClose = () => {
		this.setState({ cameraLoginFail: false });
	};

}



export default App;

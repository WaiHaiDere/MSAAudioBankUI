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
		trigger: '1',
	},
	{
		id: '5',
		message: 'After selecting a file from the table on the right, you can press the "Download" button to download the file',
		trigger: '1',
	},
	{
		id: '6',
		message: 'Don\'t worry, you can change that after you have submitted but only if you have signed in to the page',
		trigger: '9'
	},
	{
		id: '7',
		message: 'After selecting a file from the table on the right, press the "Edit" button to change the Title or Tag of the file',
		trigger: '1',
	},
	{
		id:'8',
		options: [
			{ value: 1, label: 'I entered wrong information!', trigger: '6' },
			{ value: 2, label: 'Thank you', trigger: '1' },
		],

	},
	{
		id:'9',
		options: [
			{ value: 1, label: 'How do I do that?', trigger: '7' },
			{ value: 2, label: 'Thank you', trigger: '1' },
		],
	},
	{
		id: '10',
		message: 'That means you have not logged in. Please use the button at the top left to log in.',
		trigger: '1',
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
	
	// recordOpen: any,
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
			
		}     
		
		this.fetchAudio("")
		this.selectNewAudio = this.selectNewAudio.bind(this)
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.fetchAudio = this.fetchAudio.bind(this)
		this.uploadAudio = this.uploadAudio.bind(this)
		this.authenticate = this.authenticate.bind(this)
		this.skipAuthenticate = this.skipAuthenticate.bind(this)
		this.onCloseChatModal= this.onCloseChatModal.bind(this)
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
						</div>
						<SearchByTag searchByTag={this.fetchAudio} isDark = {this.state.isDark} />
						<Button className="btn btn-primary btn-action btn-add" id="searchButton" variant="contained" color="primary" onClick={this.onOpenModal}>Add Audio</Button>
					</div>
				</div>
				<div className="container">
					<div className="row">
							<AudioList audio={this.state.audio} selectNewAudio={this.selectNewAudio} />
						
					</div>
				</div>
				<div className = "footer">
					<div className="botButton">
					<Button className="botButton" variant="fab" onClick={this.onOpenChatModal} color="primary"><LiveHelpIcon /></Button>&nbsp;
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

						<button type="button" className="btn" onClick={this.uploadAudio}>Upload</button>
					</form>
				</Modal>
				<Modal open={chatOpen} onClose={this.onCloseChatModal}>
				<div>
								<ThemeProvider theme={chatBotTheme}>
								<ChatBot botDelay='400'
									steps={chatSteps}
								/>
								</ThemeProvider>
				</div>
				</Modal>
				<Modal open={loginOpen} onClose={this.onLoginCloseModal} closeOnOverlayClick={false} showCloseIcon={false} center={true}>
					<Webcam
						audio={false}
						screenshotFormat="image/jpeg"
						ref={this.state.refCamera}
					/>
					<div className="nav-row">
						<Button className="btn btn-primary bottom-button" variant="contained" color="primary" onClick={this.authenticate}>Login</Button>&nbsp;
						<Button className="btn btn-primary bottom-button" variant="contained" color="primary" onClick={this.skipAuthenticate}>Skip For Now</Button>
					</div>
				</Modal>
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
							</div>
							<SearchByTag searchByTag={this.fetchAudio} isDark = {this.state.isDark} />
							<Button className="btn btn-primary btn-action btn-add" id="searchButton" variant="contained" color="default" onClick={this.onOpenModal}>Add Audio</Button>
						</div>
					</div>
					<div className="container">
						<div className="row">
								<AudioList audio={this.state.audio} selectNewAudio={this.selectNewAudio} />
							
						</div>
					</div>
					<div className = "footer-light">
						<div className="botButton">
						<Button className="botButton" variant="fab" onClick={this.onOpenChatModal} color="default"><LiveHelpIcon /></Button>&nbsp;
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
	
							<button type="button" className="btn" onClick={this.uploadAudio}>Upload</button>
						</form>
					</Modal>
					<Modal open={chatOpen} onClose={this.onCloseChatModal}>
					<div>
									<ThemeProvider theme={chatBotLightTheme}>
									<ChatBot botDelay='400'
										steps={chatSteps}
									/>
									</ThemeProvider>
					</div>
					</Modal>
					<Modal open={loginOpen} onClose={this.onLoginCloseModal} closeOnOverlayClick={false} showCloseIcon={false} center={true}>
						<Webcam
							audio={false}
							screenshotFormat="image/jpeg"
							ref={this.state.refCamera}
						/>
						<div className="nav-row">
							<Button className="btn btn-primary bottom-button" variant="contained" color="primary" onClick={this.authenticate}>Login</Button> &nbsp;
							<Button className="btn btn-primary bottom-button" variant="contained" color="primary" onClick={this.skipAuthenticate}>Skip For Now</Button>
						</div>
					</Modal>
				</div>
				);
		}
	}

	private onOpenChatModal =() => {
		this.setState({chatOpen: true})
	}

	private logOut =() => {
		this.setState({authenticated: false});
	}
	private onCloseChatModal =() => {
		this.setState({chatOpen: false})
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
				currentAudio = {"id":0, "title":"No audio (╯°□°）╯︵ ┻━┻","url":"","tags":"try a different tag","uploaded":"","width":"0","height":"0"}
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
				location.reload()
				
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
							this.setState({authenticated: false})
							
						}
					})
					
				}
			})
	}
}

export default App;

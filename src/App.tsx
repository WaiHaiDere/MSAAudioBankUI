import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
import AudioDetail from './components/AudioDetail';
import AudioList from './components/AudioList';
import AudioBankLogo from './audiobanklogo.png';
import * as Webcam from 'react-webcam';
import AudioRecorder from 'react-audio-recorder';
import ChatBot from 'react-simple-chatbot';



interface IState {
	currentAudio: any,
	audio: any[],
	open: boolean,
	uploadFileList: any,
	authenticated: boolean,
	refCamera: any,
	predictionResult: any,
	
	// recordOpen: any,
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			currentAudio: {"id":0, "title":"Loading ","url":"","tags":"⚆ _ ⚆","uploaded":"","width":"0","height":"0"},
			audio: [],
			open: false,
			uploadFileList: null,
			authenticated: false,
			refCamera: React.createRef(),
			predictionResult: null,
			
		}     
		
		this.fetchAudio("")
		this.selectNewAudio = this.selectNewAudio.bind(this)
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.fetchAudio = this.fetchAudio.bind(this)
		this.uploadAudio = this.uploadAudio.bind(this)
		this.authenticate = this.authenticate.bind(this)
		this.skipAuthenticate = this.skipAuthenticate.bind(this)
	}

	public render() {
		const { open, authenticated} = this.state;
		if (!(this.state.authenticated)) {
			return (
				<div>
					<Modal open={!authenticated} onClose={this.authenticate} closeOnOverlayClick={false} showCloseIcon={false} center={true}>
						<Webcam
							audio={false}
							screenshotFormat="image/jpeg"
							ref={this.state.refCamera}
						/>
						<div className="row nav-row">
							<div className="btn btn-primary bottom-button" onClick={this.authenticate}>Login</div>
							<div className="btn btn-primary bottom-button" onClick={this.skipAuthenticate}>Skip For Now</div>
						</div>
					</Modal> : ""}
				</div>
			)
		} else {
		return (
		<div>
			<div className="header-wrapper">
				<div className="container header">
					<img src={AudioBankLogo} height='40'/>&nbsp; MSA Phase 2 Audio Bank &nbsp;
					{/* <div className="btn btn-primary btn-action btn-add" onClick={this.onOpenRecordModal}>Create Audio</div> */}
					<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Add Audio</div>
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-7">
						<AudioDetail currentAudio={this.state.currentAudio} />
						<AudioRecorder downloadable={true} />
					</div>
					<div className="col-5">
						<AudioList audio={this.state.audio} selectNewAudio={this.selectNewAudio} searchByTag={this.fetchAudio}/>
					</div>
				</div>
			</div>
			<div>
				<ChatBot
					steps={[
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
							],
						  },
						  {
							id: '3',
							message: 'Press the "Add Audio" button at the top left of the page and fill in the required fields.',
							options: [
								{ value: 1, label: 'I entered wrong information!', trigger: '6' },
								{ value: 2, label: 'Thank you', trigger: '1' },
							],
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
							options: [
								{ value: 1, label: 'How do I do that?', trigger: '7' },
								{ value: 2, label: 'Thank you', trigger: '1' },
							],
						  },
						  {
							id: '7',
							message: 'After selecting a file from the table on the right, press the "Edit" button to change the Title or Tag of the file',
							trigger: '1',
						  },
					]}
				/>
			</div>
			<Modal open={open} onClose={this.onCloseModal}>
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
			{/* <Modal open={recordOpen} onClose={this.onCloseRecordModal}>
			
			</Modal> */}

		</div>
		);
		}
	}

	// private onOpenRecordModal =() => {
	// 	this.setState({recordOpen: true})
	// }

	// private onCloseRecordModal =() => {
	// 	this.setState({recordOpen: false})
	// }
	// Modal open
	private onOpenModal = () => {
		this.setState({ open: true });
	  };
	
	// Modal close
	private onCloseModal = () => {
		this.setState({ open: false });
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
			url += "/tag?=" + tag
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
		this.setState({authenticated: true})
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
						} else {
							this.setState({authenticated: false})
							
						}
					})
					
				}
			})
	}
}

export default App;

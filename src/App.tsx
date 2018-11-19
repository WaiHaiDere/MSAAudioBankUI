import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
import AudioDetail from './components/AudioDetail';
import AudioList from './components/AudioList';
import PatrickLogo from './patrick-logo.png';


interface IState {
	currentAudio: any,
	audio: any[],
	open: boolean,
	uploadFileList: any,
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			currentAudio: {"id":0, "title":"Loading ","url":"","tags":"⚆ _ ⚆","uploaded":"","width":"0","height":"0"},
			audio: [],
			open: false,
			uploadFileList: null
		}     
		
		this.fetchAudio("")
		this.selectNewAudio = this.selectNewAudio.bind(this)
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.fetchAudio = this.fetchAudio.bind(this)
		this.uploadAudio = this.uploadAudio.bind(this)
		
	}

	public render() {
		const { open } = this.state;
		return (
		<div>
			<div className="header-wrapper">
				<div className="container header">
					<img src={PatrickLogo} height='40'/>&nbsp; My Meme Bank - MSA 2018 &nbsp;
					<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Add Audio</div>
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-7">
						<AudioDetail currentAudio={this.state.currentAudio} />
					</div>
					<div className="col-5">
						<AudioList audio={this.state.audio} selectNewAudio={this.selectNewAudio} searchByTag={this.fetchAudio}/>
					</div>
				</div>
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
						<label>Image</label>
						<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="audio-image-input" />
					</div>

					<button type="button" className="btn" onClick={this.uploadAudio}>Upload</button>
				</form>
			</Modal>
		</div>
		);
	}

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
		let url = "http://phase2apitest.azurewebsites.net/api/meme"
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
		const imageFile = this.state.uploadFileList[0]

		if (titleInput === null || tagInput === null || imageFile === null) {
			return;
		}

		const title = titleInput.value
		const tag = tagInput.value
		const url = "http://phase2apitest.azurewebsites.net/api/meme/upload"

		const formData = new FormData()
		formData.append("Title", title)
		formData.append("Tags", tag)
		formData.append("image", imageFile)

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
}

export default App;

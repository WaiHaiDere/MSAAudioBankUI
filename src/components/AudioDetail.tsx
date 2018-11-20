import * as React from "react";
import Modal from 'react-responsive-modal';
import ReactAudioPlayer from 'react-audio-player';


interface IProps {
    currentAudio: any
}

interface IState {
    open: boolean
}

export default class AudioDetail extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            open: false
        }

        this.updateAudio = this.updateAudio.bind(this)
    }

	public render() {
        const currentAudio = this.props.currentAudio
        const { open } = this.state;
		return (
			<div className="container audio-wrapper">
                <div className="row audio-heading">
                    <b>{currentAudio.title}</b>&nbsp; ({currentAudio.tags})
                </div>
                <div className="row audio-date">
                    {currentAudio.uploaded}
                </div>
                <div className="row audio-img">
                <div>
                    <ReactAudioPlayer
                    src= {currentAudio.url}
                    controls />
                </div>
                    {/* <img src={currentAudio.url}/> */}
                </div>
                
                <div className="row audio-done-button">
                    <div className="btn btn-primary btn-action" onClick={this.downloadAudio.bind(this, currentAudio.url)}>Download </div>
                    <div className="btn btn-primary btn-action" onClick={this.onOpenModal}>Edit </div>
                    <div className="btn btn-primary btn-action" onClick={this.deleteAudio.bind(this, currentAudio.id)}>Delete </div>
                </div>
                <Modal open={open} onClose={this.onCloseModal}>
                    <form>
                        <div className="form-group">
                            <label>Audio Title</label>
                            <input type="text" className="form-control" id="audio-edit-title-input" placeholder="Enter Title"/>
                            <small className="form-text text-muted">You can edit any audio later</small>
                        </div>
                        <div className="form-group">
                            <label>Tag</label>
                            <input type="text" className="form-control" id="audio-edit-tag-input" placeholder="Enter Tag"/>
                            <small className="form-text text-muted">Tag is used for search</small>
                        </div>
                        <button type="button" className="btn" onClick={this.updateAudio}>Save</button>
                    </form>
                </Modal>
            </div>
		);
    }

    // Modal Open
    private onOpenModal = () => {
        this.setState({ open: true });
	  };
    
    // Modal Close
    private onCloseModal = () => {
		this.setState({ open: false });
	};

    // Open audio image in new tab
    private downloadAudio(url: any) {
        window.open(url);
    }

    // DELETE audio
    private deleteAudio(id: any) {
        const url = "https://msaaudiobankapi.azurewebsites.net/api/Audio/" + id

		fetch(url, {
			method: 'DELETE'
		})
        .then((response : any) => {
			if (!response.ok) {
				// Error Response
				alert(response.statusText)
			}
			else {
              location.reload()
			}
		  })
    }

    // PUT audio
    private updateAudio(){
        const titleInput = document.getElementById("audio-edit-title-input") as HTMLInputElement
        const tagInput = document.getElementById("audio-edit-tag-input") as HTMLInputElement

        if (titleInput === null || tagInput === null) {
			return;
		}

        const currentAudio = this.props.currentAudio
        const url = "https://msaaudiobankapi.azurewebsites.net/api/Audio/" + currentAudio.id
        const updatedTitle = titleInput.value
        const updatedTag = tagInput.value
		fetch(url, {
			body: JSON.stringify({
                "id": currentAudio.id,
                "tags": updatedTag,
                "title": updatedTitle,
                "uploaded": currentAudio.uploaded,
                "url": currentAudio.url
            }),
			headers: {'cache-control': 'no-cache','Content-Type': 'application/json'},
			method: 'PUT'
		})
        .then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText + " " + url)
			} else {
				location.reload()
			}
		  })
    }
}
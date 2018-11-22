import * as React from "react";
import Modal from 'react-responsive-modal';
import ReactAudioPlayer from 'react-audio-player';
import Button from '@material-ui/core/Button';



interface IProps {
    currentAudio: any,
    authenticated: boolean,
    isDark: boolean,
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
        const authenticated = this.props.authenticated
        const isDark = this.props.isDark
        const { open } = this.state;

        if(isDark){
            return (
                <div className="container audio-wrapper">
                    <div className="audio-details">
                        <div className="audio-heading">
                            <b>{currentAudio.title}</b>&nbsp; ({currentAudio.tags})
                        </div>
                        <div className="audio-date">
                            {currentAudio.uploaded}
                        </div>
                    </div>
                    {/* <p className="spacing">ssssss</p> */}
                    <div className="audio-container">
                        <ReactAudioPlayer className="audio-player"
                        src= {currentAudio.url}
                        controls />
                    </div>&nbsp;
                    <div className="audio-done-button">
                        <Button className="btn btn-primary btn-action" variant="contained" color="primary" onClick={this.downloadAudio.bind(this, currentAudio.url)}>Download </Button>&nbsp;
                        <p className="spacing">s</p>&nbsp;
                        { (authenticated) ?
                        <div className="conditional-buttons">
                            <Button className="btn btn-primary btn-action" variant="contained" color="primary" onClick={this.onOpenModal}>Edit </Button>&nbsp;
                            <Button className="btn btn-primary btn-action" variant="contained" color="primary" onClick={this.deleteAudio.bind(this, currentAudio.id)}>Delete </Button>
                        </div>
                        : ""}
                        { (!authenticated) ?
                        <div className="conditional-buttons">
                            <Button className="btn btn-primary btn-action" variant="contained" disabled color="primary" onClick={this.onOpenModal}>Edit </Button>&nbsp;
                            <Button className="btn btn-primary btn-action" variant="contained" disabled color="primary" onClick={this.deleteAudio.bind(this, currentAudio.id)}>Delete </Button>
                        </div>
                        : "" }
                        
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
                            <Button type="button" className="btn" variant="contained" color ="primary" onClick={this.updateAudio}>Save</Button>
                        </form>
                    </Modal>
                </div>
            );
        } else {
            return (
                <div className="container audio-wrapper">
                    <div className="audio-details">
                        <div className="audio-heading">
                            <b>{currentAudio.title}</b>&nbsp; ({currentAudio.tags})
                        </div>
                        <div className="audio-date">
                            {currentAudio.uploaded}
                        </div>
                    </div>
                    {/* <p className="spacing">ssssss</p> */}
                    <div className="audio-container">
                        <ReactAudioPlayer className="audio-player-light"
                        src= {currentAudio.url}
                        controls />
                    </div>&nbsp;
                    <div className="audio-done-button">
                        <Button className="btn btn-primary btn-action" variant="contained" color="default" onClick={this.downloadAudio.bind(this, currentAudio.url)}>Download </Button>&nbsp;
                        <p className="spacing">s</p>&nbsp;
                        { (authenticated) ?
                        <div className="conditional-buttons">
                            <Button className="btn btn-primary btn-action" variant="contained" color="default" onClick={this.onOpenModal}>Edit </Button>&nbsp;
                            <Button className="btn btn-primary btn-action" variant="contained" color="default" onClick={this.deleteAudio.bind(this, currentAudio.id)}>Delete </Button>
                        </div>
                        : ""}
                        { (!authenticated) ?
                        <div className="conditional-buttons">
                            <Button className="btn btn-primary btn-action" variant="contained" disabled color="default" onClick={this.onOpenModal}>Edit </Button>&nbsp;
                            <Button className="btn btn-primary btn-action" variant="contained" disabled color="default" onClick={this.deleteAudio.bind(this, currentAudio.id)}>Delete </Button>
                        </div>
                        : "" }
                        
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
                            <Button type="button" className="btn" variant="contained" color ="primary" onClick={this.updateAudio}>Save</Button>
                        </form>
                    </Modal>
                </div>
            );

        }
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
import * as React from "react";

interface IProps {
    audio: any[],
    selectNewAudio: any,
    searchByTag: any
}

export default class AudioList extends React.Component<IProps, {}> {
    constructor(props: any) {
        super(props)   
        this.searchByTag = this.searchByTag.bind(this)
    }

	public render() {
		return (
            
			<div className="container audio-list-wrapper">
                <div className="row audio-list-heading">
                    <div className="input-group">
                        <input type="text" id="search-tag-textbox" className="form-control" placeholder="Search By Tags" />
                        <div className="input-group-append">
                            <div className="btn btn-outline-secondary search-button" onClick = {this.searchByTag}>Search</div>
                        </div>
                    </div>  
                </div>
                <div className="row audio-list-table">
                    <table className="table table-striped">
                        <tbody>
                            {this.createTable()}
                        </tbody>
                    </table>
                </div>
                
            </div>
		);
    }

    // Construct table using audio list
	private createTable() {
        const table:any[] = []
        const audioList = this.props.audio
        if (audioList == null) {
            return table
        }

        for (let i = 0; i < audioList.length; i++) {
            const children = []
            const audio = audioList[i]
            children.push(<td key={"id" + i}>{audio.id}</td>)
            children.push(<td key={"name" + i}>{audio.title}</td>)
            children.push(<td key={"tags" + i}>{audio.tags}</td>)
            table.push(<tr key={i+""} id={i+""} onClick= {this.selectRow.bind(this, i)}>{children}</tr>)
        }
        return table
    }
    
    // Audio selection handler to display selected audio in details component
    private selectRow(index: any) {
        const selectedAudio = this.props.audio[index]
        if (selectedAudio != null) {
            this.props.selectNewAudio(selectedAudio)
        }
    }

    // Search audio by tag
    private searchByTag() {
        const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
        if (textBox === null) {
            return;
        }
        const tag = textBox.value 
        this.props.searchByTag(tag)  
    }

}
import * as React from "react";

interface IProps {
    audio: any[],
    selectNewAudio: any,
    
}


export default class AudioList extends React.Component<IProps, {}                                                                           > {
    constructor(props: any) {
        super(props)   
    }

	public render() {
		return (

                <div className="audio-list-table">
                    <table className="table table-striped">
                        <tbody>
                            {this.createTable()}
                        </tbody>
                    </table>
                    
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

}
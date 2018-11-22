import * as React from "react";
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

interface IProps {
    searchByTag: any,
    isDark: boolean,
}


export default class SearchByTag extends React.Component<IProps, {}> {
    constructor(props: any) {
        super(props)   
        this.searchByTag = this.searchByTag.bind(this)
    }

	public render() {
        const isDark = this.props.isDark
        if(isDark){
            return (
                <div className="search-container"> 
                        <TextField id="search-tag-textbox" variant="outlined" type="text" placeholder="Search By Tag" color="primary"/>
                        <IconButton id="search-tag-button"  aria-label="Search" color="primary" onClick= {this.searchByTag} >
                            <SearchIcon />
                        </IconButton>
                </div>
            );
        } else {
            return (
                <div className="search-container"> 
                        <TextField id="search-tag-textbox" variant="outlined" type="text" placeholder="Search By Tag" color="default"/>
                        <IconButton id="search-tag-button"  aria-label="Search" color="default" onClick= {this.searchByTag} >
                            <SearchIcon />
                        </IconButton>
                </div>
            );
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
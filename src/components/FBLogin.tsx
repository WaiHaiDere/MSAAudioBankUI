import * as React from "react";
import FacebookLogin from 'react-facebook-login'


interface IState {
    isLoggedIn: boolean,
    userID: any,
    name: any,
    email: any,
    picture: any,
}

interface IProps {
    callBack: any,
}

export default class FBLogin extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            isLoggedIn: false,
            userID: '',
            name: '',
            email: '',
            picture: '',
        }
    }

    private componentClicked =() => console.log("Clicked");

    private responseFacebook = (response: any) => {
        this.props.callBack(response);
    }

    public render() {
        const{isLoggedIn}= this.state
        let fbContent;

    
        if(isLoggedIn){
            fbContent = null;
        } else {
            fbContent = (<FacebookLogin
                appId="2173981646002174"
                autoLoad={true}
                fields="name,email,picture"
                onClick={this.componentClicked}
                callback={this.responseFacebook}
                cssClass="fb-login-button" />);
        }
        return(
            <div>
                {fbContent}
            </div>
        )
    }

}
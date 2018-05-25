const React = require('react');
// const ReactDOM = require('react-dom');

class LeftArea extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className="leftArea">
                {/* <h2>LeftArea</h2> */}
                {/* <div className="row">
                    <div className="objList">
                        <ul>   
                            <li>mesh1</li>
                            <li>mesh1</li>
                            <li>mesh1</li>
                        </ul>
                    </div>
                </div> */}
                <div className="row">
                    <span>选中物体 ：</span>
                    <span id="selectedName">mesh1</span>
                </div>
                <div className="row">
                    <span className="label">pos :</span> 
                    <input type="text" id="posX"/>
                    <input type="text" id="posY"/>
                    <input type="text" id="posZ"/>
                </div>
                <div className="row">
                    <span className="label">rot :</span> 
                    <input type="text" id="rotX"/>
                    <input type="text" id="rotY"/>
                    <input type="text" id="rotZ"/>
                </div>
                <div className="row">
                    <Button id="test-add" content="添加物体" onClick={this.props.addObj} />
                    <Button id="test-remove" content="删除物体" onClick={this.props.removeObj}/>
                </div>
            </div>
        );
    }
}

class RightArea extends React.Component { 
    render() {
        return (
            <div className="rightArea">
                <div id="webglArea"></div>
            </div>
        );
    }
}

class Button extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <button id={this.props.id} onClick={this.props.handleClick}>{this.props.content}</button>
        );
    }
}

class UI extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div id="renderArea">
                <LeftArea />
                <RightArea />
            </div>
        )
    }
}

module.exports = UI;

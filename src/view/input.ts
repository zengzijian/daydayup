class Input {
    public dom: any;
    public labelDom:any;
    public inputDom:any;
    constructor(name:string, id:string) {
        this.initDom(name, id);
    }
    private initDom(name:string, id:string) {
        this.dom = document.createElement("span");
        this.dom.id="wrap_" + id;

        this.labelDom = document.createElement("label");
        this.labelDom.id="label_"+id;
        this.labelDom.innerHTML = name;
        this.labelDom.setAttribute("for", "input_" + id);

        this.inputDom = document.createElement("input");
        this.inputDom.setAttribute("type", "input");
        this.inputDom.id="input_"+id;

        this.dom.appendChild(this.labelDom);
        this.dom.appendChild(this.inputDom);
    }
}
export {Input};
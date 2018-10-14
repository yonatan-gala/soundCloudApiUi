class Controller {
    constructor() {
        let height = "zz";
        let width;
        this.height = height;
        this.width = width;
    }

    // Getter
    get GetValue() {
        return {
            height: this.value().height,
            width: this.value().width
        }
    }

    get GetInit() {
        return this.init();
    }

    // Method
    value() {
        return {
            height: this.height,
            width: 30,
        }
    }

    init (){
       let s =document.createElement("div");
        document.getElementById('app').appendChild(s);
        s.innerText ="boo"

    }
}

const controlInstance = new Controller();
controlInstance.GetInit();

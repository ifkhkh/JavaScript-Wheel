class ButtonComponent {
    constructor() {
        // 初始化数据
    }

    model() {
        let d = {}
        // 清洗数据
        if (visible === true) {
            d = {
                visible: true,
                text: '',
                url: '',
            }
        } else {
            d = {
                visible: false,
            }
        }
        return d
    }

    tempButton(o) {
        let b = `
            <a href="${o.url}">${o.text}</a>
        `
        return b
    }

    temp() {
        let o = this.model()
        // 根据 o 的情况返回不同的 HTML
        if (o.visible === true) {
            return this.tempButton()
        } else {
            return ''
        }
    }

    render() {
        let b = this.temp()
        _e(this.parent).appendHTML(b)
    }
}


const __main = () => {
    let b = new ButtonComponent()
    b.render()
}

__main()

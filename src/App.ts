// autobinded
function autobind(_: any,_2: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value
    const adjdescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originMethod.bind(this)
            return boundFn
        }
    }

    return adjdescriptor
}


class ProjectInput {
    templateElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    element: HTMLFormElement
    titleInputelement: HTMLInputElement
    descriptionInputelement: HTMLInputElement
    peopleInputelement: HTMLInputElement

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement
        this.hostElement =  document.getElementById('app')! as HTMLDivElement
        const importedNode = document.importNode(this.templateElement.content,true)
        this.element = importedNode.firstElementChild as HTMLFormElement
        this.element.id = 'user-input';

        this.titleInputelement = this.element.querySelector('#title')! as HTMLInputElement;
        this.descriptionInputelement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputelement =  this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
        this.attach();
    }

 private gatherUserInput(): [string,string,number] | void{
    const enteredTitle = this.titleInputelement.value;
    const enteredDescription = this.descriptionInputelement.value;
    const enteredPeople = this.peopleInputelement.value;
    if(enteredTitle.trim().length === 0 || enteredDescription.trim().length === 0 || enteredPeople.trim().length === 0) {
        alert('Please enter valid information')
        return;
    } else {
        return [enteredTitle,enteredDescription, +enteredPeople];
    }

 }

 private clearInput() {
    this.titleInputelement.value = '';
    this.descriptionInputelement.value = '';
    this.peopleInputelement.value = ''

 }

   @autobind
    private handlesubmit(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if(Array.isArray(userInput)) {
            const [title,desc,peop] = userInput;
            console.log(title,desc,peop);
            this.clearInput();
        }
    }

    private configure() {
        this.element.addEventListener('submit',this.handlesubmit.bind(this))
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin',this.element)
    }
}

const prjInput = new ProjectInput()
// validation

interface validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    max?: number;
    min?: number; 
}

function validate(validateInput: validatable) {
    let isValid = true;
    if(validateInput.required) {
        isValid = isValid && validateInput.toString().trim().length !==0
    }

    if(validateInput.minLength != null && typeof validateInput.value === 'string') {
        isValid = isValid && validateInput.value.length >= validateInput.minLength
    }

    if(validateInput.maxLength != null && typeof validateInput.value === 'string') {
            isValid = isValid && validateInput.value.length <= validateInput.maxLength
        }
     
    if(validateInput.min != null && typeof validateInput.value === 'number') {
        isValid = isValid && validateInput.value >= validateInput.min
    }   

    if(validateInput.max != null && typeof validateInput.value === 'number') {
        isValid = isValid && validateInput.value <= validateInput.max
    }

    return isValid;
}


// autobinded
function autobind(_: any,_2: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value
    const adjdescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originMethod.bind(this);
            return boundFn;
        }
    }

    return adjdescriptor;
}


class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
  
    constructor(private type: 'active' | 'finished') {
      this.templateElement = document.getElementById(
        'project-list'
      )! as HTMLTemplateElement;
      this.hostElement = document.getElementById('app')! as HTMLDivElement;
  
      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );
      this.element = importedNode.firstElementChild as HTMLElement;
      this.element.id = `${this.type}-projects`;
      this.attach();
      this.renderContent();
    }
  
    private renderContent() {
      const listId = `${this.type}-projects-list`;
      this.element.querySelector('ul')!.id = listId;
      this.element.querySelector('h2')!.textContent =
        this.type.toUpperCase() + ' PROJECTS';
      
    }
  
    private attach() {
      this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
  }

class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputelement: HTMLInputElement;
    descriptionInputelement: HTMLInputElement;
    peopleInputelement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement =  document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content,true)
        this.element = importedNode.firstElementChild as HTMLFormElement;
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

    const titleValidatable: validatable = {
        value: enteredTitle,
        required: true,
        minLength: 5
    }

    const descriptionValidatable: validatable = {
        value: enteredDescription,
        required: true,
        minLength: 5
    }

    const peopleValidatable: validatable = {
        value: +enteredPeople,
        required: true,
        min: 1,
        max: 5,
    }

    if(
        !validate(titleValidatable) ||
        !validate(descriptionValidatable) ||
        !validate(peopleValidatable)

    ) {
        alert('ooops!Please enter valid information')
        return;
    } else {
        return [enteredTitle,enteredDescription, +enteredPeople];
    }

 }

 private clearInput() {
    this.titleInputelement.value = '';
    this.descriptionInputelement.value = '';
    this.peopleInputelement.value = '';

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
        this.element.addEventListener('submit',this.handlesubmit.bind(this));
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin',this.element);
    }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
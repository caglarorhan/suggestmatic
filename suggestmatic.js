import { tags } from "./tags.js";
export let suggestMatic = {
  suggestionIndexBegin:-1,
  init(dataObj = Array){
      if(!dataObj || !Array.isArray(dataObj) || dataObj.length<1){
          console.log(`Suggestmatic couldn't get any target trigger and/or suggestion list!`);
      }
      dataObj.forEach(data=>{
          this.madeSuggestions(data);
      })
  },
  madeSuggestions(dataObj={dropdownTriggerId:String, targetParentId:String, suggestionList:Array}){
              const dropdownTrigger = document.getElementById(dataObj.dropdownTriggerId);
              const targetParent = document.getElementById(dataObj.targetParentId) || document.getElementById("dropdownTrigger");
              const dropdownList = document.createElement('ul');
              targetParent.insertAdjacentElement('afterend',dropdownList);

              dropdownList.addEventListener('click',(event)=>{
                  let srcElm = event.target;
                  if(srcElm.tagName==='LI'){
                      dropdownTrigger.value=srcElm.textContent;
                  }
                  return false;
              })

              dropdownTrigger.addEventListener("blur", function() {setTimeout(()=>{dropdownList.style.display = "none"},200)})

              dropdownTrigger.addEventListener("focus", function() {dropdownList.style.display = "block"})

              dropdownTrigger.addEventListener('keydown',(event)=>{
                this.dropDownKeyProcessing({eventKey:event.key, eventType:event.type, dropdownTrigger:dropdownTrigger, dropdownList:dropdownList})
              })

              dropdownTrigger.addEventListener('keyup',(event)=>{this.dropDownKeyProcessing({eventKey:event.key, eventType:event.type, dropdownTrigger:dropdownTrigger, dropdownList:dropdownList})})
  },
  dropDownKeyProcessing(dataObj={eventKey:String, eventType:String, dropdownTrigger:HTMLElement, dropdownList:HTMLElement}){
    let dropdownTrigger = dataObj.dropdownTrigger;
    let dropdownList = dataObj.dropdownList;
    let arrayOfSuggestions = dropdownList.querySelectorAll('li');
    let theKey = dataObj.eventKey;
    let eventType = dataObj.eventType;


    //console.log(theKey)
    if(dropdownTrigger.value.length<4){
        dropdownList.innerHTML="";
        return false;
    }

    if(eventType==="keydown"){
      switch(theKey){
        case "ArrowDown":
        if(arrayOfSuggestions.length<1) return false;
            this.suggestionIndexBegin = (this.suggestionIndexBegin+1) % arrayOfSuggestions.length;
            //console.log(this.suggestionIndexBegin);
            arrayOfSuggestions.forEach(theLi=>theLi.classList.remove('focused'));
            arrayOfSuggestions[this.suggestionIndexBegin].classList.add('focused');
            break;
        case "ArrowUp":
        if(arrayOfSuggestions.length<1) return false;
            this.suggestionIndexBegin--;
            this.suggestionIndexBegin = (this.suggestionIndexBegin<0)? arrayOfSuggestions.length - (Math.abs(this.suggestionIndexBegin)%arrayOfSuggestions.length): this.suggestionIndexBegin;
            //console.log(this.suggestionIndexBegin);
            arrayOfSuggestions.forEach(theLi=>theLi.classList.remove('focused'));
            arrayOfSuggestions[this.suggestionIndexBegin].classList.add('focused');
            break;
      }
    }else if(!["ArrowDown", "ArrowUp"].includes(theKey)){
      switch(theKey){
        case "Enter":
        if(arrayOfSuggestions.length<1) return false;
        dropdownTrigger.value=arrayOfSuggestions[this.suggestionIndexBegin].textContent;
        dropdownList.style.display = "none";
        dropdownList.innerHTML="";
        this.suggestionIndexBegin=-1;
            break;
        default:
            //console.log('default tetiklendi');
            dropdownList.style.display = "block";
            this.setListItems({
                dropdownList:dropdownList,
                fillingArrayOfObjects:this.getFilteredSuggestions({givenPart:dropdownTrigger.value, targetArray:tags}),
                givenPart:dropdownTrigger.value
                })
            break;
      }
    }
  },
  getFilteredSuggestions(dataObj={givenPart:String, targetArray:Array}){
                  let filteredArray = [];
                  filteredArray = dataObj.targetArray.filter(item=>item.toLowerCase().includes(dataObj.givenPart.toLowerCase()));
                  //console.log(filteredArray);
                  return filteredArray;
              },
  setListItems(dataObj={dropdownList:HTMLElement, fillingArrayOfObjects:Array, givenPart:String}){
      //console.log(dataObj);
              dataObj.dropdownList.innerHTML="";
              if(!dataObj.dropdownList){console.log('Target list cannot be found!'); return false;};
              if(dataObj.fillingArrayOfObjects.length<1){console.log('Filling array is empty!'); return false;}

              dataObj.fillingArrayOfObjects.sort().forEach(fillingData=>{
                  let newListItem = document.createElement('li');

                  let firstLetterCapitalGivenPart =dataObj.givenPart.charAt(0).toUpperCase() + dataObj.givenPart.slice(1);

                  let suggestedWithBold = fillingData.replaceAll(dataObj.givenPart,`<span>${dataObj.givenPart}</span>`);  // as is
                  suggestedWithBold = suggestedWithBold.replaceAll(firstLetterCapitalGivenPart,`<span>${firstLetterCapitalGivenPart}</span>`); // first letter capital
                  suggestedWithBold = suggestedWithBold.replaceAll(firstLetterCapitalGivenPart.toLowerCase(),`<span>${firstLetterCapitalGivenPart.toLowerCase()}</span>`);  // full lower letter
                  newListItem.innerHTML= suggestedWithBold;
                  dataObj.dropdownList.appendChild(newListItem);
              })
  }
}

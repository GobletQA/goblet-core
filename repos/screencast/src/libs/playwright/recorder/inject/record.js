
const modifierKeys = [
  'altKey',
  'ctrlKey',
  'metaKey',
  'shiftKey'
]

const eventCoords = [
  'offsetX',
  'offsetY',
  'pageX',
  'pageY',
  'screenX',
  'screenY',
  'clientX',
  'clientY',
]

function exists(item){
  return (item !== undefined && item !== null && !Number.isNaN(item))
}

function loopKeyNames (e, names, checkExists) {
  return names.reduce(function(acc, name) {
    if(checkExists && exists(e[name]) || e[name]){
      if(!acc) acc = {}
      acc[name] = e[name]
    }

    return acc
  }, false)
}

function positionInNodeList(el, nodeList) {
  for (let i = 0; i < nodeList.length; i++) {
    if (el === nodeList[i]) {
      return i;
    }
  }
  return -1;
}

function findUniqueCssSelector(el) {
  const doc = el.ownerDocument;

  if (el.id && doc.querySelectorAll("#" + CSS.escape(el.id)).length === 1) {
    return "#" + CSS.escape(el.id);
  }

  // Inherently unique by tag name
  const tagName = el.localName;
  if (tagName === "html") {
    return "html";
  }
  if (tagName === "head") {
    return "head";
  }
  if (tagName === "body") {
    return "body";
  }

  // We might be able to find a unique class name
  let selector, index, matches;
  for (let i = 0; i < el.classList.length; i++) {
    // Is this className unique by itself?
    selector = "." + CSS.escape(el.classList.item(i));
    matches = doc.querySelectorAll(selector);
    if (matches.length === 1) {
      return selector;
    }
    // Maybe it's unique with a tag name?
    selector = CSS.escape(tagName) + selector;
    matches = doc.querySelectorAll(selector);
    if (matches.length === 1) {
      return selector;
    }
    // Maybe it's unique using a tag name and nth-child
    index = positionInNodeList(el, el.parentNode.children) + 1;
    selector = selector + ":nth-child(" + index + ")";
    matches = doc.querySelectorAll(selector);
    if (matches.length === 1) {
      return selector;
    }
  }

  // Not unique enough yet.
  index = positionInNodeList(el, el.parentNode.children) + 1;
  selector = CSS.escape(tagName) + ":nth-child(" + index + ")";
  if (el.parentNode !== doc) {
    selector = findUniqueCssSelector(el.parentNode) + " > " + selector;
  }
  return selector;
}

function makeTargetSelector(e) {
  return findUniqueCssSelector(e.target);
}


function makeEventData(e) {
  const event = {
    key: e.key,
    type: e.type,
    target: makeTargetSelector(e),
  }

  if(e.type === 'keypress') event.value = e.target.value + (e.key && e.key.length === 1 ? e.key : '')
  else if(exists(e.target.value)) event.value = e.target.value

  if(exists(e.target.type)) event.elementType = e.target.type
  if(exists(e.target.tagName)) event.elementTag = e.target.tagName.toLowerCase()

  if(event.elementType === 'checkbox' || event.elementType === 'radio')
    event.elementChecked = e.target.checked
  
  if(event.elementType === 'select'){
    event.selectedIndex = e.target.selectedIndex
    event.selectedText = e.target[event.selectedIndex].text
  }

  if(exists(e.dataTransfer)) event.dataTransfer = dataTransfer

  const modifiers = loopKeyNames(e, modifierKeys)
  if(modifiers) event.modifiers = modifiers

  const coords = loopKeyNames(e, eventCoords, true)
  if(coords) event.coords = coords

  return event
}

let highlighter;

function highlightOnHover(e) {
  if (!highlighter) {
    highlighter = document.createElement('div');
    highlighter.style.position = 'absolute';
    highlighter.style.zIndex = '1000';
    highlighter.style.background = '#f005';
    highlighter.style.pointerEvents = 'none';
    document.body.appendChild(highlighter);
  }
  const rect = e.target.getBoundingClientRect();
  highlighter.style.top = rect.top + 'px';
  highlighter.style.left = rect.left + 'px';
  highlighter.style.width = rect.width + 'px';
  highlighter.style.height = rect.height + 'px';
}

window.addEventListener('mousemove', e => highlightOnHover(e));
window.addEventListener('mousedown', e => window.herkinRecordAction(makeEventData(e)));
window.addEventListener('mouseup', e => window.herkinRecordAction(makeEventData(e)));
window.addEventListener('click', e => window.herkinRecordAction(makeEventData(e)));
window.addEventListener('keypress', e => window.herkinRecordAction(makeEventData(e)));
window.addEventListener('scroll', e => window.herkinRecordAction(makeEventData(e)));
window.addEventListener('cut', e => window.herkinRecordAction(makeEventData(e)));
window.addEventListener('copy', e => window.herkinRecordAction(makeEventData(e)));
window.addEventListener('paste', e => window.herkinRecordAction(makeEventData(e)));

// window.addEventListener('pointerover', e => window.herkinRecordAction(makeEventData(e)));
// window.addEventListener('pointerout', e => window.herkinRecordAction(makeEventData(e)));


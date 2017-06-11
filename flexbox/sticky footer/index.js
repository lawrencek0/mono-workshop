const button = document.getElementById('add-btn');
const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin volutpat et lorem at tempor. Maecenas id mauris et magna tincidunt pellentesque. Mauris viverra ligula nec aliquam interdum. Etiam ut molestie mi. Cras feugiat egestas metus. Cras vitae eleifend magna. Cras elementum magna eget fringilla consectetur. Nullam hendrerit euismod orci vitae semper. Nullam cursus, quam quis lacinia suscipit, erat est congue felis, vitae malesuada odio diam ac odio. Sed faucibus tempus magna. Suspendisse elementum neque eget tincidunt accumsan. Quisque aliquet ante velit, nec tincidunt mi sagittis ut. Vestibulum vel erat a erat aliquet dictum nec in arcu. In venenatis sollicitudin nunc, nec luctus arcu.";

button.addEventListener('click', event => {
    let newItem = document.createElement("p");
    let main = button.parentNode;

    const textNode = document.createTextNode(text);

    newItem.appendChild(textNode);

    main.insertBefore(newItem, button);

    window.scrollTo(0, document.body.scrollHeight);
});
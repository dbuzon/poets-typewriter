const getPoems = async () => {
    const url = "https://poetrydb.org/title";
    const response = await fetch(url);
    if (response.status !== 200) {
        throw new Error('cannot fetch data');
    }
    const poems = await response.json();
    return poems.titles;
}

const selectTitle = async (titles) => {
    const title = titles[Math.floor(Math.random()*titles.length)];
    const url = "https://poetrydb.org/title/"+title;
    const response = await fetch(url);
    if (response.status !== 200) {
        throw new Error('cannot fetch data');
    }
    const poem = await response.json();
    if (poem[0].length > 30) return selectTitle(titles);
    else return poem[0];
}

const addBreaks = (lines) => {
    let poem = "";
    for (let i = 0; i < lines.length; i++) {
        poem += lines[i] + "<br>"
    }
    return poem;
}

let index = 0;
const typing = (poem, verses) => {    
    setTimeout(() => {
        if (index === poem.length) return;
        if (poem[index] === '<') index += 2;
        verses.innerHTML = poem.slice(0, index);
        index++;
        typing(poem, verses);
    }, 90);     
}

getPoems()
    .then(titles => selectTitle(titles))
    .then(poem => {
        const title = document.getElementsByClassName("title")[0];
        title.innerHTML = poem.title;
        const author = document.getElementsByClassName("author")[0];
        author.innerHTML = poem.author;
        const verses = document.getElementsByClassName("verses")[0];
        const lines = addBreaks(poem.lines);
        typing(lines, verses);
    })
    .catch(err => console.log(err.message))
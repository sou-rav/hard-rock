const searchInput = document.getElementById('search-term');
const searchBtn = document.getElementById('search-btn');
const searchResult = document.getElementById('search-result');
const searchError = document.getElementById('search-error');
const songInfo = document.getElementById('song-info');
const songTitle = document.getElementById('song-title');
const songLyric = document.getElementById('song-lyric');

// Search button event handler
searchBtn.addEventListener('click', showSearchResults);

function showSearchResults() {
    let searchTerm = searchInput.value;

    if(searchTerm === '' || searchTerm === null){
        alert('Please enter your artist song name');
    }
    else {
        getSearchResult();       
    }
}

async function getSearchResult() {
    try {
        const response = await fetch(`https://api.lyrics.ovh/suggest/${searchInput.value}`);
        const result = await response.json();

        if(result.data.length !== 0){
            const singleItem = result.data.slice(0, 10).map(song => `
                <div class="single-result row align-items-center my-3 p-3">
                    <div class="col-md-9">
                        <img src="${song.album.cover}" class="img-fluid float-left mr-3" alt="cover-img">
                        <h4 class="mb-2">
                            <span class="badge badge-info">Title</span>
                            ${song.title}
                        </h4>
                        <h6 class="mb-2">
                            <span class="badge badge-primary">Album</span>
                            <span>${song.album.title}</span>
                        </h6>
                        <h6 class="mb-2">
                            <span class="badge badge-pill badge-light">Artist</span>
                            <span>${song.artist.name}</span> 
                        </h6>
                        <p>Duration: ${Math.floor(song.duration/60)}m ${song.duration%60}s</p>
                    </div>
                    <div class="col-md-3 text-md-right text-center">
                        <button data-title="${song.title}" data-artist="${song.artist.name}" onClick="getLyrics()" class="btn btn-success">Get Lyrics</button>
                    </div>
                </div>  
            `).join('');

            changeProperty(singleItem, '', "none");
        }  
        else {
            changeProperty('', 'No Search Result Found', "none");
        }
    }
    catch {
        changeProperty('', "No Search Results Found", "none");
    }
}

function changeProperty(result, error, display) {
    searchResult.innerHTML = result;
    searchError.innerText = error;
    searchInput.value = ''; 
    songInfo.style.display = display;
}

// get lyrics button event handler function
async function getLyrics() {
    const artist = event.target.dataset.artist;
    const title = event.target.dataset.title;
    songTitle.innerText = title;
    
    try{
        const response = await fetch(`https://api.lyrics.ovh/v1/'${artist}/${title}`);
        const data = await response.json();    

        songInfo.style.display = "block";
        songLyric.innerHTML = data.lyrics.replace(/,/g, "\n");
    }
    catch {
        songInfo.style.display = "block";
        songLyric.innerText = 'No Lyrics Found';
    }
}
/**
 * Creates the top area, in which includes the following:
 * - The logo which will return back to the homepage.
 * - The links to include as a clickable subpage area.
 * @param {object} Links The list of links to display.
 */
 const GenerateTopArea = ( Links ) =>
 {
	 const doc = document.getElementById("TopAreaLinks")
	//  const logoimg = document.createElement("img")
	//  logoimg.src = "/img/Logo.png"
	 
	 const logohref = document.createElement("a")
	 logohref.id = "logo"
	 logohref.href = "/"
 
	//  logohref.appendChild(logoimg)
	 doc.appendChild(logohref)

	 for( const L in Links )
	 {
		 const p = document.createElement("a")
		 p.textContent = L
		 p.href = `${Links[L]}/index.html`
		 doc.appendChild(p)
	 }
}

/**
 * 
 * @returns A table with key-named variables to use to parse.
 */
 function getUrlVars() {
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^#&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

/**
 * Generates the top menu items like About, Current Works and other subpages.
 */
const GenSharedTopItems = () =>
{
	const PagePath = window.location.pathname.substring(1, window.location.pathname.lastIndexOf("/") )
	const Links = {
		"Link container for other pages!": "#",
		"Some other link here!": "#",
	}
 
	if( PagePath.length > 1 )
		for( const L in Links )
		{
			if(PagePath === Links[L])
				Links[L] = "#"
		}
	GenerateTopArea( Links )
}

const CreateBlogListing = () =>
{
	let requestURL = './db.json'
	let request = new XMLHttpRequest();
	request.open('GET',requestURL);
	request.responseType = 'json';
	request.send();
	request.onload = function() {
		if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
			const data = request.response;
			let cm = document.getElementById("draw")
			console.log( data )
			
			for( const entry in data )
			{
				const item = data[entry]
				let flexcon = document.createElement("div");
				flexcon.className = 'BlogList';
	
				let a = document.createElement("a")
				a.innerHTML = `${item.Title || "title?"}`
				a.href = `./read.html?ID=${ entry }`
	
				let b = document.createElement("text")
				b.textContent = `${item.Date || "date?"}`
	
				flexcon.appendChild(a)
				flexcon.appendChild(b)
				cm.appendChild(flexcon)
				cm.appendChild( document.createElement("hr") )
			}
			request.send();
		}
	}
}

const CreateBlogEntry = () =>
{
	let l = getUrlVars();
	var client = new XMLHttpRequest();
	client.open('GET', `./Entries/${l.ID}.md`);
	client.responseType = "text";
	client.onreadystatechange = function() {
		if(client.readyState === XMLHttpRequest.DONE) {
			var status = client.status;
			//<img id='backbutton' src='lar.svg'>
			let backbutton = "<a href='index.html' alt='Return to blog listing'><img id='backbutton' src='lar.svg'></a>"
			if (status === 0 || (status >= 200 && status < 400)) {
				// Begin dealing with YAML information headers.
				let cached_lex = marked.Lexer.lex
				let headerinfo
				marked.Lexer.lex = function (text, options) {
					let parsed = yamlFront.loadFront(text)
					let cKey = '__content'
					let table = {}
					let coini = 0
					for (let k in parsed) {
						if (k === cKey) {
							continue
						}
						table[k] = parsed[k]
					}
					headerinfo = table
					// let tableMd = table.map(row => row.join('|')).join('\t')
					return cached_lex(parsed[cKey], options)
				}

				// @param object
				const ResponseText = marked(client.responseText);

				const BlogTitle = `<h1>${headerinfo["Title"] || "title?"}</h1>`
				const PostDate = `<div class="timedate">${headerinfo["Date"] || "date?"}</div>`
				document.getElementById('text-contents').innerHTML = backbutton + BlogTitle + PostDate + ResponseText;
				document.title = `${headerinfo["Title"] || "title?"}`

				const url = window.location.href
				if( headerinfo["UseTableOfContents"] )
				{
					let cont = document.getElementsByClassName("TOC-container")
					
					if( cont.length == 0 )
					{
						console.warn("[UseTableOfContents] Cannot be used. TOC-container is not defined on the blog.")
						return	// Stop operation, as the container is not available.
					}

					const titles = document.getElementById("text-contents").getElementsByTagName("h2");

					console.log(titles)
					
					// Generate the table of contents.
					const TOC = document.createElement("details")
					const summ = document.createElement("summary")
					summ.innerHTML = "Table of Contents"
					TOC.appendChild( summ )
					
					// Add all items for the content.
					const listcont = document.createElement("ul")
					for( const title of titles )
					{
						// Add the option to put the link copy on this section.
						title.onclick = function() {
							let urlarea = url
							if( url.lastIndexOf('#') !== -1 )
								urlarea = url.substring( 0, url.lastIndexOf('#') )

							window.location = `#${title.id}`
							navigator.clipboard.writeText( urlarea + `#${title.id}` )
						}
						const item = document.createElement("li")
						const link = document.createElement("a")
						link.href = `#${title.id}`
						link.textContent = title.innerText
						item.appendChild( link )
						listcont.appendChild(item)
					}
					TOC.appendChild(listcont)

					cont[0].appendChild(TOC)
				}

				// Find if the user was given an ID, and jump to that location.
				if( url.lastIndexOf('#') !== -1 )
				{
					const GroupOpen = url.substring( url.lastIndexOf('#') + 1 )
					if( GroupOpen.length > 1 )
					{
						window.location = `#${GroupOpen}`
					}
				}
			} else {
				document.getElementById('text-contents').innerHTML = backbutton + marked(`No page (${l.ID}) was found...`);
			}
		}
	}
	client.send();
}
 
/** The site's general scale. Needed for mobile phone calculations. */
const siteWidth = 640;
const scale = screen.width /siteWidth;
 
document.querySelector('meta[name="viewport"]').setAttribute('content', 'width='+siteWidth+', initial-scale='+scale+'');
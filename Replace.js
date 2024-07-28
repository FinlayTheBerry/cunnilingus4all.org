// Replace.js is a library for dynamically replacing html elements with content from other files.
// USAGE: <p replace-with="navbar.html">Navbar failed to load.</p>

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", Replace);
} else {
    Replace();
}

async function Replace() {
    let replaceTargets = Array.from(document.getElementsByTagName("*")).filter(function (element) {
        return element.hasAttribute("replace-with");
    });

    for (i = 0; i < replaceTargets.length; i++) {
        try {
            let replaceTarget = replaceTargets[i];

            let replaceURL = replaceTarget.getAttribute("replace-with");
            let response = await fetch(replaceURL);
            if (!response.ok) {
                continue;
            }
            let replaceHTML = await response.text();

            let tempContainer = document.createElement("div");
            tempContainer.innerHTML = replaceHTML;

            if (tempContainer.children.length == 0) {
                let textNode = document.createTextNode(replaceHTML);
                replaceTarget.parentElement.insertBefore(textNode, replaceTarget);
            } else {
                while (tempContainer.children.length > 0) {
                    let child = tempContainer.children[0];
                    replaceTarget.parentElement.insertBefore(child, replaceTarget);
                }
            }

            tempContainer.remove();
            replaceTarget.remove();
        } catch { continue; }
    }
}
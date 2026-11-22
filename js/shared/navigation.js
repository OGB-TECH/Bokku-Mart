// ========================================
// LOAD SHARED HEADER AND FOOTER
// ========================================

async function loadComponent(containerId, filePath) {
    
    // Find where the component should be inserted
    const container = document.getElementById(containerId);

    // Stop if the container does not exist
    if (!container) {
        console.error(`Container ${containerId} was not found.`);
        return;

    }

    try {

        // Fetch the HTML file
        const response = await fetch(filePath);

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`Failed to load ${filePath}`);
        }

        // Insert the HTML into the page
        container.innerHTML = await response.text();
    } catch (error) {
        console.error("Component loading error:", error)
    }
}


// ========================================
// SET ACTIVE CLASS
// ========================================

function setActiveNavigation() {

    // Get all navigation links
    const navLinks = document.querySelectorAll(".nav-links a")

    // Get the current page name
    const currentPage = window.location.pathname;

    // Check each navigation link
    navLinks.forEach((link) => {

        // Get the link's destination
        const linkPage = new URL(link.href).pathname;

        // Compare the current page with the link destination
        if (currentPage === linkPage) {
            
            link.classList.add("active");

        } else {

            link.classList.remove("active");
        }

    });
}


// ========================================
// LOAD HEADER AND FOOTER
// ========================================

const headerPath = new URL("../../html/shared/header.html", import.meta.url);

const footerPath = new URL("../../html/shared/footer.html", import.meta.url);

// Load the header 
await loadComponent("main-header", headerPath);
// Load the footer
await loadComponent("main-footer", footerPath);

// Set the active navigation link
setActiveNavigation();
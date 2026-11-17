// =====================================
// JOB CATEGORY POPUPS
// =====================================

// Get all category buttons
const categoryButtons = document.querySelectorAll(".job-category-heading");

// Get all popup dailogs
const jobDialogs = document.querySelectorAll(".job-dialog")


// =====================================
// OPEN POPUPS
// =====================================

categoryButtons.forEach((button) => {

    button.addEventListener("click", () => {

        // Get the ID of the popup connected to this button
        const dialogId = button.dataset.dialog;

        // Find the matching popup
        const dialog = document.getElementById(dialogId);

        // Open the popup
        if (dialog) {
            dialog.showModal();
        }
    });
});


// =====================================
// CLOSE POPUPS
// =====================================

jobDialogs.forEach((dialog) => {

    // Get the top X close button
    const topCloseButton = dialog.querySelector(".close-dialog");

    // Get the bottom close button
    const bottomCloseButton = dialog.querySelector(".dialog-close-button")

    // Close using the x button
    if (topCloseButton) {
        topCloseButton.addEventListener("click", () => {
            dialog.close();
        });
    }

    // Close using the bottom close button
    if (bottomCloseButton) {
        bottomCloseButton.addEventListener("click", () => {
            dialog.close()
        });
    }

    // Close when clicking outside the popup
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
});
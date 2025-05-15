const courses = ["Meditación", "Yoga", "Mindfulness", "Relajación", "Masajes"];
const mostSold = [150, 120, 100, 90, 80];
const leastSold = [10, 15, 20, 25, 30];
const abandonedCourses = [20, 25, 10, 15, 5];
const completedCourses = [100, 110, 90, 85, 80];


function createBarChart(ctx, labels, data, title, bgColor, borderColor) {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                backgroundColor: bgColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createPieChart(ctx, labels, data, title) {
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#F44336'
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const mostSoldCtx = document.getElementById("mostSoldChart").getContext("2d");
    createBarChart(mostSoldCtx, courses, mostSold, "Cursos Más Vendidos", "rgba(54, 162, 235, 0.5)", "rgba(54, 162, 235, 1)");

    const leastSoldCtx = document.getElementById("leastSoldChart").getContext("2d");
    createBarChart(leastSoldCtx, courses, leastSold, "Cursos Menos Vendidos", "rgba(255, 99, 132, 0.5)", "rgba(255, 99, 132, 1)");

    const abandonedCoursesCtx = document.getElementById("abandonedCoursesChart").getContext("2d");
    createPieChart(abandonedCoursesCtx, courses, abandonedCourses, "Cursos Abandonados");

    const completedCoursesCtx = document.getElementById("completedCoursesChart").getContext("2d");
    createPieChart(completedCoursesCtx, courses, completedCourses, "Cursos Completados");
});
document.getElementById("downloadPdf").addEventListener("click", async () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const charts = [
        { id: "mostSoldChart", title: "Cursos Más Vendidos" },
        { id: "leastSoldChart", title: "Cursos Menos Vendidos" },
        { id: "abandonedCoursesChart", title: "Cursos Abandonados" },
        { id: "completedCoursesChart", title: "Cursos Completados" }
    ];

    let yPosition = 10;

    for (const chart of charts) {
        const canvas = document.getElementById(chart.id);
        const imgData = await html2canvas(canvas).then(canvas => canvas.toDataURL("image/png"));

        pdf.text(chart.title, 10, yPosition);
        pdf.addImage(imgData, "PNG", 10, yPosition + 10, 180, 100);
        yPosition += 120;

        if (yPosition > 250) { // Add a new page if needed
            pdf.addPage();
            yPosition = 10;
        }
    }

    pdf.text("Reporte General y Ganancias", 10, yPosition + 10);
    pdf.text("Ganancia Total: $12,750", 10, yPosition + 20);
    pdf.text("Ganancia Promedio por Curso: $2,550", 10, yPosition + 30);
    pdf.text("Curso con Más Ganancia: Meditación ($4,500)", 10, yPosition + 40);

    pdf.save("Reportes_Cursos.pdf");
});
import "core-js/stable";
import "regenerator-runtime/runtime";
import Chart from 'chart.js';
const axios = require('axios');

const apiBaseUrl = API_URL;

async function generateGraphs() {
    const packageListReq = await axios.get(`${apiBaseUrl}/api/v0/packages`);
    const packages = packageListReq.data;

    for (let packageData of packages._embedded.packages) {
        let graphContainer = document.createElement('div');
        let containerId = `container-${packageData.language}-${packageData.library}`;
        graphContainer.setAttribute('id', containerId);
        graphContainer.classList.add('flex', 'w-1/3', 'flex-grow-0', 'flex-shrink-0', 'relative');

        let graphCanvas = document.createElement('canvas');
        let canvasId = `chart-${packageData.language}-${packageData.library}`;
        graphCanvas.setAttribute('id', canvasId);
        graphCanvas.classList.add('stats-chart');

        graphContainer.appendChild(graphCanvas);
        document.getElementById('graph-container').appendChild(graphContainer);

        let statsReq = await axios.get(`${apiBaseUrl}${packageData._links['self']['href']}`);
        let options = {
            options: {
                responsive: true,
                maintainAspectRation: true,
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                stepSize: 1
                            }
                        }
                    ]
                }
            },
            type: "line",
            data: {
                labels: [],
                datasets: [{
                    label: `${packageData.library} (${packageData.language}) Downloads`,
                    data: [],
                    fill: false,
                    lineTension: 0
                }]
            }
        }

        for (let stat of statsReq.data.stats) {
            const chunks = new Date(stat.date).toISOString().split('T');
            options.data.labels.push(chunks[0]);
            options.data.datasets[0].data.push(stat.downloads);
        }

        let ctx = document.getElementById(canvasId).getContext('2d');
        let chart = new Chart(ctx, options);
    }
}

generateGraphs();

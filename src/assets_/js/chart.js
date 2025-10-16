$(document).ready(function() {

	// Bar Chart

	var barChartData = {
		labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
		datasets: [{
			label: 'Dados Otimistas',
			backgroundColor: 'rgb(21, 71, 171)',
			borderColor: 'rgba(0, 158, 251, 1)',
			borderWidth: 1,
			data: [35, 59, 80, 81, 56, 55, 40]
		}, {
			label: 'Dados Pessimistas',
			backgroundColor: 'rgba(255, 188, 53, 0.5)',
			borderColor: 'orange',
			borderWidth: 1,
			data: [28, 48, 40, 19, 86, 27, 90]
		}]
	};

	var ctx = document.getElementById('bargraph').getContext('2d');
	window.myBar = new Chart(ctx, {
		type: 'bar',
		data: barChartData,
		options: {
			responsive: true,
			legend: {
				display: false,
			}
		}
	});

	// Line Chart

	var lineChartData = {
		labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
		datasets: [{
			label: "Total de Quadros 1",
			backgroundColor: "rgba(0, 158, 251, 0.5)",
			data: [100, 70, 20, 100, 120, 50, 70, 50, 50, 100, 50, 90]
		}, {
		label: "Total de Quadros 2",
		backgroundColor: "orange",
		fill: true,
		data: [28, 48, 40, 19, 86, 27, 20, 90, 50, 20, 90, 20]
		}]
	};

	var linectx = document.getElementById('linegraph').getContext('2d');
	window.myLine = new Chart(linectx, {
		type: 'line',
		data: lineChartData,
		options: {
			responsive: true,
			legend: {
				display: false,
			},
			tooltips: {
				mode: 'index',
				intersect: false,
			}
		}
	});

	// Bar Chart 2

    barChart();

    $(window).resize(function(){
        barChart();
    });

    function barChart(){
        $('.bar-chart').find('.item-progress').each(function(){
            var itemProgress = $(this),
            itemProgressWidth = $(this).parent().width() * ($(this).data('percent') / 100);
            itemProgress.css('width', itemProgressWidth);
        });
    };
});

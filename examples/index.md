# 滚动触发器

---

<style>
a{color:#06F;cursor:pointer;}
a:hover{text-decoration:underline;color:#F60;}
#container{position:relative;height:1500px;}
#container .lamp{background:#E6E6E6;border:3px solid #CCC;}
#container .light{background:#FFF799;border-color:#ABA000;}
.lamp{position:absolute;display:block;width:120px;height:120px;padding:10px;}
#lamp-1{left:0;top:150px;}
#lamp-2{left:500px;top:350px;}
#lamp-3{left:400px;top:600px;}
#lamp-4{left:0;top:850px;}
#lamp-5{left:0;top:1200px;}
</style>

<div id="container">
	<input type="button" id="run" value="Start Trigger" />
	<input type="button" id="stop" value="Stop Trigger" />
	<br />
	<br />
	Left:<input type="text" id="left" size="4" />
	Top:<input type="text" id="top" size="4" />
	<select id="one-off">
		<option value="0">Forever</option>
		<option value="1">One-off</option>
	</select>
	<input type="button" id="insert" value="Insert" />

	<div id="lamp-1" class="lamp"><strong>#1</strong><br />Forever<br /><br /><a class="remove">Remove</a></div>
	<div id="lamp-2" class="lamp"><strong>#2</strong><br />Stop when #5 is light<br /><br /><a class="remove">Remove</a></div>
	<div id="lamp-3" class="lamp"><strong>#3</strong><br />One-off<br /><br /><a class="remove">Remove</a></div>
	<div id="lamp-4" class="lamp"><strong>#4</strong><br />Forever<br /><br /><a class="remove">Remove</a></div>
	<div id="lamp-5" class="lamp"><strong>#5</strong><br />One-off<br /><br /><a class="remove">Remove</a></div>
</div>

````js
seajs.use(['$', 'js/6v/lib/icbu/scroll-trigger/scroll-trigger.js'], function($, ScrollTrigger) {

	// tiggle function, it can light up and die out the lamps
	var tiggle = function() {
		if($(this).is('.light')) {
			$(this).removeClass('light');
		} else {
			$(this).addClass('light');
		}
	}

	// add
	ScrollTrigger.add({
		element: $('#lamp-1'),
		onRouse: tiggle
	});
	ScrollTrigger.add({
		element: '#lamp-2',
		onRouse: tiggle
	});
	ScrollTrigger.add({
		element: '#lamp-3',
		onRouse: tiggle,
		oneoff: true
	});
	ScrollTrigger.add({
		element: $('#lamp-4'),
		distance: 300,
		onRouse: tiggle
	});
	ScrollTrigger.add({
		element: '#lamp-5',
		onRouse: function(){
			tiggle.apply($('#lamp-5'));
			ScrollTrigger.remove({element: $('#lamp-2')});
		},
		options: null,
		oneoff: true
	});

	// run trigger
	$('#run').click(function(){
		ScrollTrigger.start();
	});

	// stop trigger
	$('#stop').click(function(){
		ScrollTrigger.stop();
	});

	//remove
	$('#container a.remove').click(function(ev){
		var lamp = $(this).parent();
		ScrollTrigger.remove({element: lamp});
		lamp.remove();
	});

	// insert
	$('#insert').click(function(){
		var left = parseInt($('#left').val(), 10);
		var top = parseInt($('#top').val(), 10);
		var isOneOff = false;
		var text = '<strong>#Inerted</strong><br />Forever<br /><br /><a class="remove">Remove</a>';
		if($('#one-off').val() === '1') {
			isOneOff = true;
			text = '<strong>#Inerted</strong><br />One-off<br /><br /><a class="remove">Remove</a>';
		}

		if(!left || !top) {
			alert('Please entry valid LEFT and TOP.')
		}

		var lamp = $('<div class="lamp"></div>');
		lamp.html(text);
		lamp.css({
			position: 'absolute',
			left: left + 'px',
			top: top + 'px'
		});
		lamp.appendTo($('#container'));

		ScrollTrigger.add({
			element: lamp,
			onRouse: tiggle,
			options: null,
			oneoff: isOneOff
		});

		lamp.find('a.remove').click(function(){
			var lamp = $(this).parent();
			ScrollTrigger.remove({element: lamp});
			lamp.remove();
		});
	});

});
````
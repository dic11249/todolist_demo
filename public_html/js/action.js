$(document).ready(function () {

	//todo list item structure
	var source = $('#todo-list-item-template').html();
	var todoTemplate = Handlebars.compile(source);

	// prepare all todo list items
	var todoListUI = '';
	$.each(todos, function(index, todo){
		todoListUI = todoListUI + todoTemplate(todo);
	});
	$('#todo-list').find('li.new').before(todoListUI);

	//enter editor mode
	$('#todo-list')
	.on('dblclick','.content',function(e){
		$(this).prop('contenteditable',true).focus();
	})
	.on('blur','.content', function(e){
		//create
		var isNew = $(this).closest('li').is('.new');
		if (isNew) {
			var todo = $(e.currentTarget).text();
			todo = todo.trim();
			if(todo.length>0) {
				var order = $('#todo-list').find('li:not(.new)').length + 1;
				console.log(order);
				console.log(todo);
				//Ajax: create API
				$.ajax({
					url:'todo/create.php',
					type:'POST',
					dataType:'json',
					data:{content: todo, order: order},
					complete:function(){

					},
					success:function(data, textStatus, xhr){
						todo = {
							id: data.id,
							is_complete: false,
							content: todo,
						};
						var li = todoTemplate(todo);
						$(e.currentTarget).closest('li').before(li);
					},
					error:function(){

					}

				});

				
			}
			// clear new todo item
			$(e.currentTarget).empty();
		//update
		} else {
			//AJAX call
			var id = $(this).closest('li').data('id');
			var content = $(this).text();
			$.post('todo/update.php',{id: id, content: content});
			$(this).prop('contenteditable',false);
		}
		
	})
	//delete
	.on('click','.delete',function(e){
		var result = confirm('確認是否刪除?');
		if(result) {
			// AJAX call
			var id = $(this).closest('li').data('id');
			$.post('todo/delete.php',{id: id}, function (data, textStatus, xhr) {
				$(e.currentTarget).closest('li').remove();
			});
		} 
	})
	.on('click','.checkbox',function(e){
		//AJAX call
		var id = $(this).closest('li').data('id');
		$.post('todo/complete.php',{id: id}, function (data, textStatus, xhr) {
			$(e.currentTarget).closest('li').toggleClass('complete');
		});

	});


	$('#todo-list').find('ul').sortable({
		items:'li:not(.new)',
		cancel: 'input,textarea,button,select,option,[contenteditable]',
		stop: function () {
			var orderPair = [];
			$('#todo-list').find('li:not(.new)').each(function (index, li) {
				orderPair.push({
					id: $(li).data('id'),
					order: index + 1,
				});
			});

			//AJAX call
			$.post('todo/sort.php',{orderPair: orderPair});
		},
	})


});
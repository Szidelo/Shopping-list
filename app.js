$(document).ready(function () {
	// Clear All Selectors

	const clearBtn = $("#clear");

	// List Selectors

	const foodList = $("#foodList");
	const clothList = $("#clothList");
	const gadgetList = $("#gadgetList");

	// Input for every list Selectors

	const inputForFood = $("#foodInput");
	const inputForCloth = $("#clothInput");
	const inputForGadget = $("#gadgetInput");

	// Add btn for every list Selector

	const addBtnFood = $("#addFood");
	const addBtnCloth = $("#addCloth");
	const addBtnGadget = $("#addGadget");

	// List elements Selector

	const checkBtn = $(".form-check-input");
	const listText = $("span");

	// To Do function

	const addToDoFood = (toDo, id, done, trash) => {
		if (trash) return;

		const isChecked = done ? true : false;
		const associatedTextLineThrough = done ? true : false;

		const item = `
                    <li class="list-group-item d-flex justify-content-between align-items-center row">
                        <div class="col-9 d-flex">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                value=""
                                aria-label="..."
                                status="complete"
                                id="${id}"
                                ${isChecked ? "checked" : ""}
                            />
                            <span class="${
															associatedTextLineThrough ? "line-through" : ""
														}">${toDo}</span>
                        </div>
                        <div class="col-3 text-end">
                            <i class="fas fa-trash-alt" status="delete" id="${id}" style="cursor: pointer"></i>
                        </div>
                    </li>
        `;

		const liElement = $(item);

		liElement.on("click", function () {
			// Remove "active" class from all li elements
			foodList.find("li").removeClass("active");

			// Add "active" class to current li element
			liElement.addClass("active");
		});

		foodList.append(liElement);
	};

	// To Do Conainer

	const loadFoodContainer = (array) => {
		array.forEach(function (item) {
			addToDoFood(item.name, item.id, item.done, item.trash);
		});
	};

	let foodContainer, id;

	let foodData = localStorage.getItem("food-item");

	if (foodData) {
		foodContainer = JSON.parse(foodData);
		id = foodContainer.length;
		loadFoodContainer(foodContainer);
	} else {
		foodContainer = [];
		id = 0;
	}

	// displayToDo function

	const displayToDo = (e) => {
		if (
			e.which === 13 ||
			e.target.classList.value === "fas fa-plus-square fa-2x"
		) {
			const toDo = inputForFood.val();
			if (toDo) {
				addToDoFood(toDo, id, false, false);
				foodContainer.push({
					name: toDo,
					id: id,
					done: false,
					trash: false,
				});

				// Updating local storage

				localStorage.setItem("food-item", JSON.stringify(foodContainer));

				id++;
			}
			inputForFood.val("");
		}
	};

	// Remove item

	const removeToDo = (toDoItem) => {
		toDoItem.closest("li").remove();
		const itemId = toDoItem.attr("id");
		foodContainer[itemId].trash = true;
	};

	// Completed item

	const completeToDo = (toDoItem) => {
		const liElement = toDoItem.closest("li");
		const spanElement = liElement.find("span");
		spanElement.toggleClass("line-through");

		const itemId = toDoItem.attr("id");
		foodContainer[itemId].done = toDoItem.prop("checked");
	};

	// Targeting the dynamically created items

	foodList.on("click", function (e) {
		if (
			e.target.localName === "span" ||
			e.target.localName === "li" ||
			e.target.localName === "div" ||
			e.target.localName === "ul"
		)
			return;

		const toDoItem = $(e.target);
		const toDoStatus = toDoItem.attr("status");

		if (toDoStatus === "complete") {
			completeToDo(toDoItem);
		} else if (toDoStatus === "delete") {
			removeToDo(toDoItem);
		}

		localStorage.setItem("food-item", JSON.stringify(foodContainer));
	});

	// Add item to the list on enter key

	$(this).on("keyup", displayToDo);

	// Add item to the list on click plus icon

	addBtnFood.on("click", displayToDo);

	// Clear all

	clearBtn.on('click', function() {
		localStorage.clear();
		location.reload();
	})
});

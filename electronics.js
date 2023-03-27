$(document).ready(function () {
	// Clear All Selectors

	const clearBtn = $("#clear");

	// List Selectors

	const gadgetList = $("#gadgetList");

	// Input for every list Selectors

	const inputForGadget = $("#gadgetInput");

	// Add btn for every list Selector

	const addBtnGadget = $("#addGadget");

	// To Do function

	const addToDoGadget = (toDo, id, done, trash) => {
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
			gadgetList.find("li").removeClass("active");

			// Add "active" class to current li element
			liElement.addClass("active");
		});

		gadgetList.append(liElement);
	};

	// To Do Conainer

	const loadGagetContainer = (array) => {
		array.forEach(function (item) {
			addToDoGadget(item.name, item.id, item.done, item.trash);
		});
	};

	let gadgetContainer, id;

	let gadgetData = localStorage.getItem("gadget-item");

	if (gadgetData) {
		gadgetContainer = JSON.parse(gadgetData);
		id = gadgetContainer.length;
		loadGagetContainer(gadgetContainer);
	} else {
		gadgetContainer = [];
		id = 0;
	}

	// displayToDo function

	const displayGadgetToDo = (e) => {
		if (
			e.which === 13 ||
			e.target.classList.value === "fas fa-plus-square fa-2x"
		) {
			const toDo = inputForGadget.val();
			if (toDo) {
				addToDoGadget(toDo, id, false, false);
				gadgetContainer.push({
					name: toDo,
					id: id,
					done: false,
					trash: false,
				});

				// Updating local storage

				localStorage.setItem("gadget-item", JSON.stringify(gadgetContainer));

				id++;
			}
			inputForGadget.val("");
		}
	};

	// Remove item

	const removeToDo = (toDoItem) => {
		toDoItem.closest("li").remove();
		const itemId = toDoItem.attr("id");
		gadgetContainer[itemId].trash = true;
	};

	// Completed item

	const completeToDo = (toDoItem) => {
		const liElement = toDoItem.closest("li");
		const spanElement = liElement.find("span");
		spanElement.toggleClass("line-through");

		const itemId = toDoItem.attr("id");
		gadgetContainer[itemId].done = toDoItem.prop("checked");
	};

	// Targeting the dynamically created items

	gadgetList.on("click", function (e) {
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

		localStorage.setItem("gadget-item", JSON.stringify(gadgetContainer));
	});

	// Add item to the list on enter key

	$(this).on("keyup", displayGadgetToDo);

	// Add item to the list on click plus icon

	addBtnGadget.on("click", displayGadgetToDo);

	// Clear all

	clearBtn.on('click', function() {
		localStorage.clear();
		location.reload();
	})
});

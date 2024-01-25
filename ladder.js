window.addEventListener ("load", event =>
{	event.preventDefault();

	//	Event listeners for miscellaneous buttons
	document.getElementById("about-button").addEventListener ("click", event => { aboutClickHandler(event) } );
	document.getElementById("help-button").addEventListener ("click", event => { helpClickHandler(event) } );
	document.getElementById("reload-button").addEventListener ("click", event => { location.reload() } );

	//	Events associated with the selection of delimiters
	document.getElementById("delimiter-wrapper").addEventListener ("change", event => { delimiterChangeHandler(event) } );
	document.getElementById("import-ladder").addEventListener ("change", event => { textareaEventHandler(event) } );
//	document.getElementById("import-ladder").addEventListener ("blur", event =>
	document.getElementById("import-ladder").addEventListener ("focus", event => { textareaFocusHandler (event) } );

	//	And the event listener for the import button
	document.getElementById("import-button").addEventListener ("click", event => { importClickHandler(event) } );

})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Event handlers for 'about' amd 'help' buttons
//

function aboutClickHandler ()
{	//	Create a pop-up window with description of the application
	//	Make sure "how to use" is hidden...
	hideElement (document.getElementById ("use-div"));

	//	And display "about"
	displayElement (document.getElementById ("about-div"));
	displayElement (document.getElementById ("about-wrapper"));
}

function helpClickHandler ()
{	//	Create a pop-up window with description of the application

	//	Make sure "how to use" is hidden...
	hideElement (document.getElementById ("use-div"));

	//	And display "about"
	displayElement (document.getElementById ("about-div"));
	displayElement (document.getElementById ("about-wrapper"));
}

function displayElement (e)
{	//	Alter the element's classList to make the element visible.  Remove class 'hide' and add class 'display'.

//		e.classList.remove ("hide");
//		e.classList.add ("display");
e.classList.remove ("hidden");
}

function hideElement (e)
{	//	Alter the element's classList to hide the element.  Remove class 'display' and add class 'hide'.

//		e.classList.remove ("display");
//		e.classList.add ("hide");
e.classList.add ("hidden");
}

function closePopUp ()
{	//	Close (hide) the pop-up window
	//
	//	Closing the pop-up window is simply making sure that none of the elements of the window are displayed.  Add
	//	'hidden' to the classList of popup-wrapper as well as about-div and use-div.

	hideElement (document.getElementById ("about-div"));
	hideElement (document.getElementById ("about-wrapper"));
	hideElement (document.getElementById ("use-div"));
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Event handlers and associated functions for the <textarea> and radio <input> elements.  These events are primarilly
//	used to determine what delimiter is used by the input dataset.
//
//	blur and focus events may be added to the <textarea> in the future, but the application should work just as well
//	without them.

function textareaEventHandler (event)
{	event.preventDefault();
	const target = event.target;

	//	A change has made to the textarea.  This function detects whether there is data in the textarea and modifies
	//	the 'delimiter message' and import button accordingly.

	//	The textarea is intended to enter a text string representing a one-dimensional array of words.  This application
	//	isn't intended to create and edit the ladder, only to validate it.  It is expected that the ladder will be
	//	created with a spreadsheet and entered in the textarea by copy-and-paste.  Since it isn't possible to
	//	copy-and-paste an array, individual elements of the array must be delimited by some repeating character.  The
	//	commonly used options are commas, tabs and new line characters.  Tabs and new line characters are usually used
	//	together to signify two dimensional arrays (a table, for instance).  The data must include one of these
	//	delimiters in order to convert the string to an array.

	const input = document.getElementById("import-ladder").value;

	if (input == "")
	{	//	The textarea does not contain data.  Since this event is triggered by a change, we can assume that it did
		//	contain data previously and the import button is enabled.  Disable the import button.
		setDelimterMessage ("");
		enableImportButton (false);
	}
	else
	if (findChar (input, "\n"))
	{	//	The data set contains NEW-LINE (\n) characters.  This is typically used by spreadshhets to delimit rows
		//	of tables during a copy-and-paste.  We'll make that assumption... 

		selectRadioButton ("line-delimited");
		hideOtherInput (true);
		enableImportButton (true);
	}
	else
	if (findChar (input, "\t"))
	{	//	The data set contains TAB (\t) characters.  This is typically used by spreadshhets to delimit cells within
		//	a row of a tables during a copy-and-paste.  Even though the application did not find NEW-LINE (\n), we'll make
		//	that assumption... 

		selectRadioButton ("tab-delimited");
		hideOtherInput (true);
		enableImportButton (true);
	}
	else
	if (findChar (input, ","))
	{	//	The data set contains commas.  This is commonly used by applications to export arrays... 

		selectRadioButton ("comma-delimited");
		hideOtherInput (true);
		enableImportButton (true);
	}
	else
	{	//	None of the expected characters was found, but that doesn't mean there are no delimiters.  Let the user specify
		//	the delimiter, but don't enable the import button.

		selectRadioButton ("other-delimited");
		hideOtherInput (false);
		enableImportButton (false);
	}
}

function findChar (data, delimiter)
{	//	Used to determine what character is used as a delimiter.

	if (data.indexOf (delimiter) < 0) return false;
	return true;
}

function selectRadioButton (which)
{	//	The application has determined what type of delimiter is in use based on the data, but the user gets the
	//	final say.

	//	First...de-select ALL of the radio buttons
	const opt = document.getElementsByName ("delimiter-selector");
	opt.forEach (r => { r.checked = false; } );

	//	And select one
	document.getElementById (which).checked = true;

	//	and make it visible
	document.getElementById ("delimiter-wrapper").classList.remove ("hidden");
}

function delimiterChangeHandler (event)
{	event.preventDefault();
	const target = event.target;

	//	Handle change events in to the delimiter selector.  Because the selecter is actually a collection of four radio
	//	<input> elements, the event listener is added to the parent element of the selector.  One listener, rather than four.
	//
	//	I'm not going to bother checking what type of DOM element triggered the event.  Something did, and the only elements
	//	in the container that can are the <input> elements of the selector.  But which one?

	// let selected = undefined;

	// const opt = document.getElementsByName ("delimiter-selector");
	// opt.forEach (r => { if (r.checked) selected = r.getAttribute ("id"); } );
const selected = findSelection ();

	if (selected == "other-delimited")
	{
		hideOtherInput (false);
		enableImportButton (false);
	}
	else
	{
		hideOtherInput (true);
		enableImportButton (true);
	}
}

function hideOtherInput (display)
{	//	The 'other-delimiter' is an option that allows the user to select how the dataset is formatted.  Just because
	//	none of the expected delimiters were found in the dataset doesn't mean there are none.  Any character or string
	//	could be used and likely possibilities include spaces, colons, semi-colons, forward slashes and even vertical lines.
	//
	//	If 'other' is selected, an <input> field should be displayed.  That <input> should be hidden if any other option
	//	is selected.  The <input> is hidden by adding a class named 'hidden' to its classList.  The same class is removed
	//	to display it.

	const e = document.getElementById ("other-delimiter");

	if (display) e.classList.add ("hidden");
	else e.classList.remove ("hidden");
}

function enableImportButton (enable)
{	//	Enables or disables the import button depending on the value entered in the textarea.

	const button = document.getElementById("import-button");
	if (enable) button.removeAttribute ("disabled")
	else button.setAttribute ("disabled", true)
}

function textareaFocusHandler (event)
{	event.target.select();

	//	This application may use a background image in the textarea to communicate instructions.  If so, the background
	//	needs to be removed whenever the textarea is not empty.  And replaced if the contents of the <textarea> are deleted.
	//	That would probably be best in a 'blur', 'change', 'drop' or 'paste' event.  Maybe all four.  Do 'drop' and 'paste'
	//	events exist?
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Event handlers and associated functions for the 'import' click event.  This is the meat and potatoes of the
//	application.
//

function importClickHandler (event)
{	event.preventDefault();
	const target = event.target;

	//	The import button was clicked, several things need to happen.

	//	Hide the import-section and display ladder-section
	hideElement (document.getElementById ("import-section"));
	displayElement (document.getElementById ("ladder-section"));

	//	This is the core functionality of the application.
	//
	//	Convert the input to an array, create DOM elements to display each rung, validate the entries and display
	//	appropriate messages.
	const ladder = document.getElementById ("import-ladder").value.split (findDelimiter());
	ladder.forEach ((l, i) =>
	{
		//	Trim the elements of the array to remove extraneous whitespce.  It seems that the variable 'l' is not
		//	a reference to the corresponding element of the array -- trimming one does not trim the other.  So explicitly
		//	trim the elements of the array as well as the working variable 'l'.  I would not have this problem (and some
		//	others) if this were a for-loop -- maybe it should be.

		ladder[i] = ladder[i].trim();
		l = l.trim();

		const rung = createRung (l, i);

		//	There is nothing to compare the first rung of the ladder to.

		if (i > 0) validateRung (ladder, rung, i);
	})
}

function createRung (rung, index)
{	//	Add a rung to the ladder.  The steps of an actual ladder are called rungs and the terminology has stuck for
	//	word ladders.  Each word in a word ladder is called a 'rung'.
	//
	//	This function creates a <div> that contains two read only <input>.  One to display the rung and one to display
	//	optional messages that may be generated later.

	getLadder().append (div);

	const div = document.createElement ("div");

	const number = document.createElement ("input");
	number.classList.add ("number");
	number.setAttribute ("id", "number");
	number.setAttribute ("readonly", true);
	number.value = index;
	div.append (number);

	const word = document.createElement ("input");
	word.classList.add ("word");
	word.setAttribute ("id", "word");
	word.setAttribute ("readonly", true);
	word.value = rung;
	div.append (word);

	const message = document.createElement ("input")
	message.setAttribute ("id", "message");
	div.append (message);
}

function validateRung (ladder, rung, index)
{	//	Validating the rungs (and ladder as a whole) is handled as a function call from the event handler, rather
	//	than in-line in the handler.
	//
	//	This allows the function to return after any error is found, simplifying the code and making it easier to
	//	understand.  Some errors may go undetected, but it isn't necessary to find every one, one error anywhere in the
	//	ladder invalidates the whole ladder.

// //	There is nothing to compare the first rung of the ladder to.

// if (index == 0) return;

	//	All rungs in the ladder must be the same length.  I need a standard, and I choose the first rung of the ladder.
	//	It's a completely arbitrary decision.

	if (a.length < ladder[0].length)
	{	errorMessage (rung, "This rung is too short");
		return;
	}

	if (a.length > ladder[0].length)
	{	errorMessage (rung, "This rung is too long");
		return;
	}

	//	Each rung in the ladder must differ from the previous rung by one, and only one, letter; e.g.; 'fish' amd 'wish'.
	//	Compare this rung to the rung immediately above it.

	const count = countChangedLetters (i);

	if (count == 0)
	{
		errorMessage (rung, "This rung duplicates the previous rung.  It's unnecessary");
		return;
	}

	if (count > 1)
	{
		errorMessage (rung, "There are missing rungs");
		return;
	}

	//	The same word should not be used more than once.

	if (findDuplicates (i))
	{
		errorMessage (rung, "This word has been used previously");
		return;
	}

	//	Each rung in the ladder must differ from the previous rung by one, and only one, letter.  But the position of
	//	the changed letter should not be the same in two or more rungs.  For instance, 'then', 'than' and 'that' is okay, 
	//	'then', 'than' and 'thin' is not.  The change is in the third letter each time.  This is called a 'bung' and it's
	//	frowned upon.  Although it doesn't invalidate the ladder, the middle word can be eliminated without affecting it.

	if (findBungs (i))
	{	//	Unlike other error messages, this message should go on the previous rung.

	}
}

//	01	This function is depricated
// function reNumberRungs ()
// {	//	A rung has been inserted somewhere in the ladder.  If it was inserted somewhere before the end, the rung
// 	//	number and indices are now wrong and need to be reassigned based on the position of the rungs in the ladder.
// 	//
// 	//	Most of the time, the new rung is at the end of the ladder, and I could just assign the number and indices
// 	//	based on the length of the ladder.  But it isn't always added to the end, and then I need a different method
// 	//	to assign those indices  Having two methodologies complicates things a bit.  I have to know which 'Add' button
// 	//	was clicked (I do) and perform the appropriate procedure.  Renumbering is a relatively trivial operation, and
// 	//	even a long word ladder won't have 100 entries.  Having one methodology, instead of two, simplifies program
// 	//	flow and makes maintenance more efficient.
// 	//
// 	//	So I'm always going to renumber...

// 	const ladder = Array.from (getLadder().children);

// 	ladder.forEach ((rung, index) =>
// 	{
// 		rung.setAttribute ("id", "rung-" + index);
// 		rung.setAttribute ("index", index);

// 		const number = rung.querySelector ("#number");
// 		number.setAttribute ("index", index);
// 		number.value = index;

// 		const input = rung.querySelector ("#word");
// 		input.setAttribute ("index", index);

// 		const button = rung.querySelector ("#add");
// 		button.setAttribute ("index", index);

// 		const span = rung.querySelector ("#span")
// 		span.setAttribute ("index", index);
// 	})
// }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Event handlers for blur and focus events

//	01	This function is depricated
// let saveIndex = undefined;
// let saveValue = undefined;

// function blurEventHandler (event)
// {	event.preventDefault();
// 	const target = event.target;

// 	//	If I'm going to use the ESC key to undo changes made to a word in the ladder, I have to know which word was
// 	//	being edited...and the <input> is not exposed by a keydown or keyup event.  So I'm listening for blur and focus
// 	//	events, which do identify the <input> element.

// 	//	On a side note...w3schools lies.  These event listeners were originally coded on the parent element of the rungs.
// 	//	I was using blur and focus events, but they never triggered.  I 'learned' on w3schools that blur and focus events
// 	//	don't bubble up, but focusout and focusin do (and they're supposedly the same thing, otherwise).  Good.  I can
// 	//	handle focusout and focusin events on any number of <input> elements with just one event listener on their parent
// 	//	element.  When I tested I discovered these events are only triggered when the parent lost focus...in other words
// 	//	when you left the page.  So I moved the .addEventListener() and added one to each of the <input> elements.  No
// 	//	change.  The event still only triggers when the PAGE loses focus.  So I switched back to using blur and focus events
// 	//	but I have them on each <input>.  Now it works the way I want it to, except I have multiple event listeners instead
// 	//	of just one.
// 	//
// 	//	So much for documentation.

// 	//	The cursor has left the <input> without the ESC key being pressed.  The cursor is not currently in any
// 	//	<input> field (although it will be shortly).  Set currentIndex and currentValue equal to 'undefined'.

// 	saveIndex = undefined;
// 	saveValue = undefined;

// 	if (target.value == "")
// 	{	//	Any <input> element (other than the last one in the ladder) should be removed from the DOM if there is no text
// 		//	in the <input> element when it looses focus.  Remove the entire rung, the parent container, the sequence
// 		//	number, the word, the add button, etc.  That <div> is the parent of the <input> that triggered this event.
		
// 		if (target.parentElement != getLadder().lastChild)
// 			getLadder().removeChild (target.parentElement);
// 	}
// 	else
// 	{
// 		checkForDuplicates (target);
// 		clearBungMessage();
// 		checkForBungs();
// 	}
// }

function checkForDuplicates (word)
{	//	Check the ladder for duplicate entries.  But comparing every entry to every entry is not very efficient, I only
	//	need to compare each combination of word once.  So, compare the value each word <input> to only those words that
	//	precede it in the ladder.

	const ladder = document.getElementById ("ladder");
	const rungs = Array.from (ladder.children);
	rungs.forEach ((r1, i1) =>
	{
		rungs.forEach ((r2, i2) =>
		{
			if (i1 > i2)
			{
				const input1 = r1.querySelector ("#word");
				const input2 = r2.querySelector ("#word");

				if (input1.value == input2.value)
					putMessage (input1, "This word is already in the ladder");
				else
				{
					const span = input1.parentElement.querySelector ("#span");
					if (span.innerText == "This word is already in the ladder") span.innerText = "";
				}
			}
		})
	})
}

function clearBungMessage()
{	//	Iterate through the ladder and remove the text "The ladder has a bung" from each rung's message <span>.  Leave
	//	any other messages intact.

	const ladder = document.getElementById ("ladder");
	const rungs = Array.from (ladder.children);

	rungs.forEach (r =>
	{
		const span = r.querySelector ("#span");
		if (span.innerText == "The ladder has a bung") span.innerText = "";
	})

}

function checkForBungs ()
{	//	Check for 'bungs'  A bung is a condition where the changed letter in two consequitive word pairs is in the
	//	same position of their respective words.  For instance: feed → feel → feet.  'feed' and 'feel' differ only in
	//	the fourth letter.  Likewise, 'feel' and 'feet' differ only in the fourth letter.  The middle word ('feel')
	//	could be omitted without affecting the ladder.
	//
	//	Bungs are allowed, but are considered bad form.

	//	It would be most efficient to only check for bungs that include the word being edited, but even a long ladder only
	//	has 30 to 40 entries, certainly fewer than 100.  So even checking every combination in the ladder will be quick
	//	enough that a user probably wouldn't notice.

	const rungs = Array.from (document.getElementById ("ladder").children);

	for (let i=0; i<rungs.length; i++)
	{	//	For each rung in the ladder, compare the word contained in that rung with the words in the rungs
		//	immediately before and after.

		try
		{
			const first = rungs[i-1].querySelector ("#word");
			const second = rungs[i].querySelector ("#word");
			const third = rungs[i+1].querySelector ("#word");

			if (bungFound (first, second, third))
			{	putMessage (first, "The ladder has a bung");
				putMessage (second, "The ladder has a bung");
				putMessage (third, "The ladder has a bung");

				return false;
			}
		}
		catch (error)
		{	//	Attempting to access an element that isn't in the DOM will throw an error.  There is no elememt before
			//	the first or after the last.  This is expected and the code is wrapped in a try-block the keep the
			//	script from crashing.  There is nothing to do here and the catch() really isn't needed.  It's only
			//	here because JavaScript requires it.
		}
	}

	return true;
}

function bungFound (one, two, three)
{	//	Check for bungs.  A bung is consequetive word pairs that change letters in the same position. For instance:
	//	feed → feel → feet.  Bungs are considered bad form as the middle word (in this case 'feel') is unnecessary.  It
	//	can be removed without affecting the ladder.

	//	Since this script iterates through the entire ladder, some combinations of rungs don't exist.  There isn't
	//	a rung immediately preceeding the first rung in the ladder, for instance.  I only need to check those combinations
	//	that do exist.

	if (!one) return;
	if (!three) return;

	let changeAt1 = undefined;
	let changeAt2 = undefined;

	for (let i=0; i<one.value.length; i++)
	{
		if (one.value.charAt(i) != two.value.charAt(i)) changeAt1 = i;
		if (two.value.charAt(i) != three.value.charAt(i)) changeAt2 = i;
	}

	return (changeAt1 == changeAt2);
}

function importEventHandler (event)
{	event.preventDefault();
	target = event.target;

	//	This function handles a click event on the inport button.
	//	Convert the data in the textarea to an array
	//	Iterate that array...
	//		Create a DOM element to display the current element of the array
	//		Invoke existing functions to validate this entry
}

// function tooShort (current)
// {	//	All of the words in a word ladder must be the same number of characters.  Compare the length of value in the
// 	//	<input> element currently being edited with some standard.  There are two possibilities for that standard:
// 	//	the first word in the ladder and the immediately preceding word in the ladder.  I choose to use the first, as
// 	//	that seems to obviate some error conditions...it always exists.

// 	const rung = getLadder().firstChild;
// 	const first = rung.querySelector ("#word");

// 	return (current.value.length < first.value.length);
// }

// function tooLong (current)
// {	//	All of the words in a word ladder must be the same number of characters.  Compare the length of value in the
// 	//	<input> element currently being edited with some standard.  There are two possibilities for that standard:
// 	//	the first word in the ladder and the immediately preceding word in the ladder.  I choose to use the first, as
// 	//	that seems to obviate some error conditions...it always exists.

// 	const rung = getLadder().firstChild;
// 	const first = rung.querySelector ("#word");

// 	return (current.value.length > first.value.length);
// }

function duplicatesPrevious (current)
{	//	Compare the value in the current <input> element with the immediately preceding rung.  Return any appropriate
	//	messages.
	//
	//	The <input> to be compared are child elements of a parent container.  The parent containers are siblings.  I
	//	suppose that means the <input> elements are cousins.

	const cousin = getCousin (current);

	//	And compare...	Check for missing rungs (a word pair with more than one letter different)

	let count = 0;

	for (let i=0; i<current.value.length; i++)
	{
		if (current.value.charAt(i) != cousin.value.charAt(i)) ++count;
	}

	return (count == 0);
}

function missingRungs (current)
{	//	Compare the value in the current <input> element with the immediately preceding rung.  Return any appropriate
	//	messages.
	//
	//	The <input> to be compared are child elements of a parent container.  The parent containers are siblings.  I
	//	suppose that means the <input> elements are cousins.

	const cousin = getCousin (current);

	//	And compare...	Check for missing rungs (a word pair with more than one letter different)

	let count = 0;

	for (let i=0; i<current.value.length; i++)
	{
		if (current.value.charAt(i) != cousin.value.charAt(i)) ++count;
	}

	return (count != 1);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Various utility functions used throughout the script

// function disableAddButton (element)
// {	//	Disable the add button that is a sibling of the indicated <input> element.

// 	element.parentElement.querySelector ("#add").setAttribute ("disabled", true);
// }

// function enableAddButton (element)
// {	//	Disable the add button that is a sibling of the indicated <input> element.

// 	element.parentElement.querySelector ("#add").removeAttribute ("disabled");
// }

function findDelimiter ()
{	//	Returns the string (probably a single character) used to format the imported dataset.  This delimiter
	//	is used to convert the dataset to an array of strings.

	const id = findSelection ();

	if (id == "comma-delimited") return (",");
	if (id == "line-delimited") return ("\n");
	if (id == "tab-delimited") return ("\t");

	return document.getElementById ("other-delimiter").value;
}

function findSelection ()
{	//	Returns the id of the radio button that was selected by the application or user

	let id = undefined;

	const opt = document.getElementsByName ("delimiter-selector");
	opt.forEach (r => { if (r.checked) id = r.getAttribute ("id"); } );

	return id;
}

// function getCousin (element, next = false)
function getPreviousCousin (element)
{	//	This function returns the <input> element of immediately adjacent rungs.  The parameter next is used to select
	//	rung the immediately before or after the element in question.
	//
	//	<input> elements are children of rungs, and rungs are siblings.  That means the <input> elements are cousins.

	const parent = element.parentElement;
	const uncle = next ? parent.nextSibling : parent.previousSibling;
	return uncle.querySelector ("#word");
}

// function getNextCousin (element)
// {	getCousin (element, true);
// }

function getLadder ()
{	//	Return a reference to the <div> element that contains the rungs...

	return document.getElementById ("ladder-section");
}

function putMessage (input, message)
{	//	Put the indicated message into the message <span> element for the currently selected <input>

	const rung = input.parentElement;
	rung.querySelector ("#span").innerText = message;
}

window.addEventListener ("load", event =>
{	event.preventDefault();

	//	Event listeners for miscellaneous buttons
	document.getElementById("about-button").addEventListener ("click", event => { aboutClickHandler(event) } );
	document.getElementById("help-button").addEventListener ("click", event => { helpClickHandler(event) } );
	document.getElementById("reload-button").addEventListener ("click", event => { location.reload() } );

	//	Events associated with the selection of delimiters
	document.getElementById("delimiter-wrapper").addEventListener ("change", event => { delimiterChangeHandler(event) } );
	document.getElementById("import-ladder").addEventListener ("change", event => { textareaEventHandler(event) } );
//	This doesn't do what I thought it did...I want an event that is triggered when something is pasted into an 
//	element
//		document.getElementById("import-ladder").addEventListener ("paste", event => { textareaEventHandler(event) } );
//		document.getElementById("import-ladder").addEventListener ("paste", event => { document.getElementById("import-ladder").change (event) } );
//	Both of the above prevent the data being pasted into the textarea, rather than detecting the event and alloing me to
//	execute the change handler.
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
{
	// event.preventDefault();
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

	document.getElementById ("import-button").focus( { focusVisible: true } );
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

function createRung (value, index)
{	//	Add a rung to the ladder.  The steps of an actual ladder are called rungs and the terminology has stuck for
	//	word ladders.  Each word in a word ladder is called a 'rung'.
	//
	//	This function creates a <div> that contains two read only <input>.  One to display the rung and one to display
	//	optional messages that may be generated later.

	const rung = document.createElement ("div");
	rung.classList.add ("rung");
	getLadder().append (rung);

	const number = document.createElement ("input");
	number.classList.add ("number");
	number.setAttribute ("id", "number");
	number.setAttribute ("readonly", true);
	number.value = index;
	rung.append (number);

	const word = document.createElement ("input");
	word.classList.add ("word");
	word.setAttribute ("id", "word");
	word.setAttribute ("readonly", true);
	word.value = value;
	rung.append (word);

	const message = document.createElement ("input")
	message.classList.add ("message");
	message.setAttribute ("id", "message");
	message.setAttribute ("readonly", true);
	rung.append (message);

	return rung;
}

function validateRung (ladder, rung, index)
{	//	Validating the rungs (and ladder as a whole) is handled as a function call from the event handler, rather
	//	than in-line in the handler.
	//
	//	This allows the function to return after any error is found, simplifying the code and making it easier to
	//	understand.  Some errors may go undetected, but it isn't necessary to find every one, one error anywhere in the
	//	ladder invalidates the whole ladder.

	//	All rungs in the ladder must be the same length.  I need a standard, and I choose the first rung of the ladder.
	//	It's a completely arbitrary decision.

	if (ladder[index].length < ladder[0].length)
	{	errorMessage (rung, "This word is too short");
		return;
	}

	if (ladder[index].length > ladder[0].length)
	{	errorMessage (rung, "This word is too long");
		return;
	}

	//	Each rung in the ladder must differ from the previous rung by one, and only one, letter; e.g.; 'fish' amd 'wish'.
	//	Compare this rung to the rung immediately above it.

	const count = countChanges (ladder, index);

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

	if (findDuplicates (ladder, index))
	{
		errorMessage (rung, "This word has been used already.");
		return;
	}

	//	Each rung in the ladder must differ from the previous rung by one, and only one, letter.  But the position of
	//	the changed letter should not be the same in two or more rungs.  For instance, 'then', 'than' and 'that' is okay, 
	//	'then', 'than' and 'thin' is not.  The change is in the third letter each time.  This is called a 'bung' and it's
	//	frowned upon.  Although it doesn't invalidate the ladder, the middle word can be eliminated without affecting it.

	if (index > 1)
	{	//	Bungs involve a minimum of three consequetive words, so the earliest a bung can appear in a ladder is the
		//	third rung (index = 2).

		//	Bungs are a special case.  The actual error is in the previous rung so that's where the error message goes.
		//	But just because there were no other errors for this rung doesn't mean there were none for the previous rung.
		//	And most errors are more important than bungs.  Only perform this test is no errors were found on the previous
		//	rung.

		if (!rung.previousSibling.classList.contains ("error"))
		{
			if (findBungs (ladder, index))
			{	//	Unlike other error messages, this message should go on the previous rung.

				errorMessage (rung.previousSibling, "A bung has been detected.  This word is unnecessary.");
				return;
			}
		}
	}
}

function countChanges (ladder, index)
{	//	Each word in a word ladder must differ from the previous word by one, and only one, letter.  Compare the word
	//	at ladder[index] to the word at ladder[index-1].  Count the letters that are different.

	let count = 0;

	for (let i=0; i<ladder[index].length; i++)
	{
		if (ladder[index].charAt(i) != ladder[index-1].charAt(i)) count++;
	}

	return count;
}

function findDuplicates (ladder, index)
{	//	Check the ladder for duplicate entries.  But comparing every entry to every entry is not very efficient, I only
	//	need to compare each combination of word once.  So, compare the value each word <input> to only those words that
	//	precede it in the ladder.

	let duplicate = false;
	ladder.forEach ((l, i) =>
	{
		if (i != index)
		{
			if (ladder[index] == ladder[i]) duplicate = true;
		}
	})
	return duplicate;
}

function findBungs (ladder, index)
{	//	A bung is consequetive word pairs that change letters in the same position. For instance: feed → feel → feet.
	//	Bungs are considered bad form as the middle word (in this case 'feel') is unnecessary.  It can be removed without
	//	affecting the ladder.

	for (let i=0; i<ladder[index].length; i++)
	{
		if ((ladder[index].charAt(i) != ladder[index-1].charAt(i)) && (ladder[index-1].charAt(i) != ladder[index-2].charAt(i)))
			return true;
	}

	return false;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Various utility functions used throughout the script
//

//	Alter an element's classList to make the element visible.  Elements are hidden by including a class 'hidden' in their
//	classList.  Remove that class and the element should display.

function displayElement (e) { e.classList.remove ("hidden"); }

function errorMessage (rung, message)
{	//	Put the indicated message into the message <span> element for the currently selected <input>

	rung.querySelector ("#message").value = message;
	rung.classList.add ("error");
}

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

//	getLadder() returns a reference to the parent element of the rungs, a <section> with id = 'ladder-section'

function getLadder () { return document.getElementById ("ladder-section"); }

//	Alter an element's classList to hide the element.  Elements are hidden by including a class 'hidden' in their
//	classList.

function hideElement (e) { e.classList.add ("hidden"); }


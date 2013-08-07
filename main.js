/*
 * Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, window, $, Mustache, navigator, setTimeout */

define(function (require, exports, module) {
    "use strict";

    // Brackets modules
    var PreferencesManager          = brackets.getModule("preferences/PreferencesManager"),
        Commands                    = brackets.getModule("command/Commands"),
        CommandManager              = brackets.getModule("command/CommandManager"),
        ExtensionUtils              = brackets.getModule("utils/ExtensionUtils"),
        Strings                     = brackets.getModule("strings"),
        StringUtils                 = brackets.getModule("utils/StringUtils"),
        Menus                       = brackets.getModule("command/Menus");


    /** @const {string} Extension Command ID */
    var MY_COMMANDID                = "flame.throw";
    var MY_MENUID                   = "flame-menu";

    /* Our extension's preferences */
    var prefs = PreferencesManager.getPreferenceStorage(module);

    /* Cache our module info */
    var _module = module;




    var alphaChars = vkAlpha.concat(vkNumeric);
    var printableChars = alphaChars.concat(vkSymbol);

    function _getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function _getRandomCharacter() {
        return alphaChars[_getRandomInt(0, alphaChars.length)];
    }

    function pumpKeystrokes(count) {
        var i;

        var pumpNext = function () {
            brackets.app.postNativeKeyEvent(_getRandomCharacter());
        };

        var typeOneChar = function () {
            setTimeout(pumpNext, 100);
        };

        for (i = 0; i < count; i++) {
            typeOneChar();
        }
    }

    function startTyping() {
        pumpKeystrokes(10000);
    }

    function throwFlames() {
        // creaet a document
        // start pushing chars
        CommandManager.execute(Commands.FILE_NEW_UNTITLED);
        setTimeout(startTyping, 10000);
    }


    // Register the command -- The command and the command title are kept together
    CommandManager.register("Flame Thrower", MY_COMMANDID, throwFlames);
    // Add a new menu before the help menu.
    //  if you want to modify an existing menu you would use Menus.getMenu -- e.g. Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    var menu = Menus.addMenu("Flame", MY_MENUID, Menus.BEFORE, Menus.AppMenuBar.HELP_MENU);
    // Now add the menu item to invoke it.  Add a keyboard shortcut as well.
    menu.addMenuItem(MY_COMMANDID);
});

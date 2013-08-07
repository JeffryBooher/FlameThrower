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
        KeyEvent                    = brackets.getModule("utils/KeyEvent"),
        Menus                       = brackets.getModule("command/Menus");

    var KeyboardPrefs               = JSON.parse(require("text!keyboard.json"));


    /** @const {string} Extension Command ID */
    var START_COMMANDID             = "flame.throw";
    var STOP_COMMANDID              = "flame.stop";
    var MY_MENUID                   = "flame-menu";

    /* Our extension's preferences */
    var prefs = PreferencesManager.getPreferenceStorage(module);

    /* Cache our module info */
    var _module = module;


    var kVK_ANSI_A                    = 0x00,
        kVK_ANSI_S                    = 0x01,
        kVK_ANSI_D                    = 0x02,
        kVK_ANSI_F                    = 0x03,
        kVK_ANSI_H                    = 0x04,
        kVK_ANSI_G                    = 0x05,
        kVK_ANSI_Z                    = 0x06,
        kVK_ANSI_X                    = 0x07,
        kVK_ANSI_C                    = 0x08,
        kVK_ANSI_V                    = 0x09,
        kVK_ANSI_B                    = 0x0B,
        kVK_ANSI_Q                    = 0x0C,
        kVK_ANSI_W                    = 0x0D,
        kVK_ANSI_E                    = 0x0E,
        kVK_ANSI_R                    = 0x0F,
        kVK_ANSI_Y                    = 0x10,
        kVK_ANSI_T                    = 0x11,
        kVK_ANSI_1                    = 0x12,
        kVK_ANSI_2                    = 0x13,
        kVK_ANSI_3                    = 0x14,
        kVK_ANSI_4                    = 0x15,
        kVK_ANSI_6                    = 0x16,
        kVK_ANSI_5                    = 0x17,
        kVK_ANSI_Equal                = 0x18,
        kVK_ANSI_9                    = 0x19,
        kVK_ANSI_7                    = 0x1A,
        kVK_ANSI_Minus                = 0x1B,
        kVK_ANSI_8                    = 0x1C,
        kVK_ANSI_0                    = 0x1D,
        kVK_ANSI_RightBracket         = 0x1E,
        kVK_ANSI_O                    = 0x1F,
        kVK_ANSI_U                    = 0x20,
        kVK_ANSI_LeftBracket          = 0x21,
        kVK_ANSI_I                    = 0x22,
        kVK_ANSI_P                    = 0x23,
        kVK_ANSI_L                    = 0x25,
        kVK_ANSI_J                    = 0x26,
        kVK_ANSI_Quote                = 0x27,
        kVK_ANSI_K                    = 0x28,
        kVK_ANSI_Semicolon            = 0x29,
        kVK_ANSI_Backslash            = 0x2A,
        kVK_ANSI_Comma                = 0x2B,
        kVK_ANSI_Slash                = 0x2C,
        kVK_ANSI_N                    = 0x2D,
        kVK_ANSI_M                    = 0x2E,
        kVK_ANSI_Period               = 0x2F,
        kVK_ANSI_Grave                = 0x32,
        kVK_ANSI_KeypadDecimal        = 0x41,
        kVK_ANSI_KeypadMultiply       = 0x43,
        kVK_ANSI_KeypadPlus           = 0x45,
        kVK_ANSI_KeypadClear          = 0x47,
        kVK_ANSI_KeypadDivide         = 0x4B,
        kVK_ANSI_KeypadEnter          = 0x4C,
        kVK_ANSI_KeypadMinus          = 0x4E,
        kVK_ANSI_KeypadEquals         = 0x51,
        kVK_ANSI_Keypad0              = 0x52,
        kVK_ANSI_Keypad1              = 0x53,
        kVK_ANSI_Keypad2              = 0x54,
        kVK_ANSI_Keypad3              = 0x55,
        kVK_ANSI_Keypad4              = 0x56,
        kVK_ANSI_Keypad5              = 0x57,
        kVK_ANSI_Keypad6              = 0x58,
        kVK_ANSI_Keypad7              = 0x59,
        kVK_ANSI_Keypad8              = 0x5B,
        kVK_ANSI_Keypad9              = 0x5C,
        kVK_Return                    = 0x24,
        kVK_Tab                       = 0x30,
        kVK_Space                     = 0x31,
        kVK_Delete                    = 0x33,
        kVK_Escape                    = 0x35,
        kVK_Command                   = 0x37,
        kVK_Shift                     = 0x38,
        kVK_CapsLock                  = 0x39,
        kVK_Option                    = 0x3A,
        kVK_Control                   = 0x3B,
        kVK_RightShift                = 0x3C,
        kVK_RightOption               = 0x3D,
        kVK_RightControl              = 0x3E,
        kVK_Function                  = 0x3F,
        kVK_F17                       = 0x40,
        kVK_VolumeUp                  = 0x48,
        kVK_VolumeDown                = 0x49,
        kVK_Mute                      = 0x4A,
        kVK_F18                       = 0x4F,
        kVK_F19                       = 0x50,
        kVK_F20                       = 0x5A,
        kVK_F5                        = 0x60,
        kVK_F6                        = 0x61,
        kVK_F7                        = 0x62,
        kVK_F3                        = 0x63,
        kVK_F8                        = 0x64,
        kVK_F9                        = 0x65,
        kVK_F11                       = 0x67,
        kVK_F13                       = 0x69,
        kVK_F16                       = 0x6A,
        kVK_F14                       = 0x6B,
        kVK_F10                       = 0x6D,
        kVK_F12                       = 0x6F,
        kVK_F15                       = 0x71,
        kVK_Help                      = 0x72,
        kVK_Home                      = 0x73,
        kVK_PageUp                    = 0x74,
        kVK_ForwardDelete             = 0x75,
        kVK_F4                        = 0x76,
        kVK_End                       = 0x77,
        kVK_F2                        = 0x78,
        kVK_PageDown                  = 0x79,
        kVK_F1                        = 0x7A,
        kVK_LeftArrow                 = 0x7B,
        kVK_RightArrow                = 0x7C,
        kVK_DownArrow                 = 0x7D,
        kVK_UpArrow                   = 0x7E;


    var vkAlpha = [
            kVK_ANSI_A,
            kVK_ANSI_B,
            kVK_ANSI_C,
            kVK_ANSI_D,
            kVK_ANSI_E,
            kVK_ANSI_F,
            kVK_ANSI_G,
            kVK_ANSI_H,
            kVK_ANSI_I,
            kVK_ANSI_J,
            kVK_ANSI_K,
            kVK_ANSI_L,
            kVK_ANSI_N,
            kVK_ANSI_M,
            kVK_ANSI_O,
            kVK_ANSI_P,
            kVK_ANSI_Q,
            kVK_ANSI_R,
            kVK_ANSI_S,
            kVK_ANSI_T,
            kVK_ANSI_U,
            kVK_ANSI_V,
            kVK_ANSI_W,
            kVK_ANSI_X,
            kVK_ANSI_Y,
            kVK_ANSI_Z
        ];

    var vkNumeric = [
            kVK_ANSI_1,
            kVK_ANSI_2,
            kVK_ANSI_3,
            kVK_ANSI_4,
            kVK_ANSI_6,
            kVK_ANSI_5,
            kVK_ANSI_9,
            kVK_ANSI_7,
            kVK_ANSI_8,
            kVK_ANSI_0,
            kVK_ANSI_Keypad0,
            kVK_ANSI_Keypad1,
            kVK_ANSI_Keypad2,
            kVK_ANSI_Keypad3,
            kVK_ANSI_Keypad4,
            kVK_ANSI_Keypad5,
            kVK_ANSI_Keypad6,
            kVK_ANSI_Keypad7,
            kVK_ANSI_Keypad8,
            kVK_ANSI_Keypad9
        ];

    var vkSymbol = [
            kVK_ANSI_Equal,
            kVK_ANSI_Minus,
            kVK_ANSI_RightBracket,
            kVK_ANSI_LeftBracket,
            kVK_ANSI_Quote,
            kVK_ANSI_Semicolon,
            kVK_ANSI_Backslash,
            kVK_ANSI_Comma,
            kVK_ANSI_Slash,
            kVK_ANSI_Period,
            kVK_ANSI_Grave,
            kVK_ANSI_KeypadDecimal,
            kVK_ANSI_KeypadMultiply,
            kVK_ANSI_KeypadPlus,
            kVK_ANSI_KeypadClear,
            kVK_ANSI_KeypadDivide,
            kVK_ANSI_KeypadMinus,
            kVK_ANSI_KeypadEquals
        ];

    var vkControl = [
            kVK_Return,
            kVK_ANSI_KeypadEnter,
            kVK_Tab,
            kVK_Space,
            kVK_Delete,
            kVK_ForwardDelete,
            kVK_Escape
        ];

    var vkShift = [
            kVK_Command,
            kVK_Shift,
            kVK_CapsLock,
            kVK_Option,
            kVK_Control,
            kVK_RightShift,
            kVK_RightOption,
            kVK_RightControl,
            kVK_Function
        ];

    var vkSpecial = [
            kVK_VolumeUp,
            kVK_VolumeDown,
            kVK_Mute,
            kVK_Help
        ];

    var vkFunction = [
            kVK_F1,
            kVK_F2,
            kVK_F3,
            kVK_F4,
            kVK_F5,
            kVK_F6,
            kVK_F7,
            kVK_F8,
            kVK_F9,
            kVK_F10,
            kVK_F11,
            kVK_F12,
            kVK_F13,
            kVK_F14,
            kVK_F15,
            kVK_F16,
            kVK_F17,
            kVK_F18,
            kVK_F19,
            kVK_F20
        ];

    var vkNavigation = [
            kVK_Home,
            kVK_PageUp,
            kVK_End,
            kVK_PageDown,
            kVK_LeftArrow,
            kVK_RightArrow,
            kVK_DownArrow,
            kVK_UpArrow
        ];

    var alphaChars = vkAlpha.concat(vkNumeric);
    var printableChars = alphaChars.concat(vkSymbol);

    var _running = false,
        _okToRun = true;

    /** @const {int} Timeout value so browser can repaint */
    var PAINT_CYCLE_MS = 1000;

    /** @const {int} number of keys to try */
    var KEY_FAB_COUNTER = 1000;

    function _getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function _getRandomCharacter() {
        return printableChars[_getRandomInt(0, printableChars.length)];
    }

    function simulateKeyEvent(charCode) {
        var evt = window.document.createEvent("KeyboardEvent");
        evt.initKeyboardEvent("keypress", true, true, window, 0, 0, 0, 0, 0, charCode);
        window.document.activeElement.dispatchEvent(evt);
    }

    function pumpKeystrokes(count, randomizeEnterKey) {
        var i = 0,
            result = $.Deferred();

        var pumpNext = function () {
            if (!_okToRun) {
                result.reject();
            } else {
                try {
                    if (i++ < count) {
                        if (randomizeEnterKey && (_getRandomInt(0, 9) === 7)) {
                            brackets.app.postNativeKeyEvent(kVK_Return, pumpNext);
                        } else {
                            brackets.app.postNativeKeyEvent(_getRandomCharacter(), pumpNext);
                        }
                    } else {
                        // if we're done hit escape to close a modal input if open
                        brackets.app.postNativeKeyEvent(kVK_Escape, function () {
                            result.resolve();
                        });
                    }
                } catch (e) {
                    result.reject();
                }
            }
        };

        pumpNext();
        return result;
    }

    function startTyping(randomizeEnterKey) {
        if (brackets.platform === "mac") {
            return pumpKeystrokes(_getRandomInt(0, KEY_FAB_COUNTER), randomizeEnterKey);
        } else {
            console.log("Simulate injectingKeys...");
            // close whatever box was up if any
            simulateKeyEvent(KeyEvent.VK_ESCAPE);
            return (new $.Deferred()).resolve().promise();
        }
    }

    function execCommandAndStartTyping(commandId, randomizeEnterKey) {
        // create a document and start typing
        var result = new $.Deferred();

        var handleCreate = function () {
            startTyping(randomizeEnterKey)
                .done(function () {
                    result.resolve();
                })
                .fail(function () {
                    result.reject();
                });
        };

        CommandManager.execute(commandId)
            .done(function () {
                setTimeout(handleCreate, PAINT_CYCLE_MS);
            })
            .fail(function () {
                result.reject();
            });

        return result;
    }


    function doQuickOpen() {
        return execCommandAndStartTyping(Commands.NAVIGATE_QUICK_OPEN);
    }

    function doFindInFiles() {
        return execCommandAndStartTyping(Commands.EDIT_FIND_IN_FILES);
    }

    function doNewDocument() {
        return execCommandAndStartTyping(Commands.FILE_NEW_UNTITLED, true);
    }

    function doTypeInDocument() {
        return startTyping(true);
    }

    function doSpray() {
        var result = new $.Deferred(),
            operations = [doQuickOpen, doFindInFiles, doTypeInDocument];

        var bail = function () {
            result.reject();
        };

        while (true) {
            operations[_getRandomInt(0, operations.length)].call.apply().fail(bail());
        }


        return result;

    }

    function doCreateDocumentAndSpray() {
        var result = new $.Deferred();

        doNewDocument()
            .done(function () {

            })
            .fail(function () {
                result.reject();
            });

        return result;
    }

    function throwFlames() {
        _running = true;
        _okToRun = false;
        doCreateDocumentAndSpray().always(function () {
            _running = false;
            _okToRun = true;
            alert("Flames have been extinguished");
        });
    }

    function extinguishFlames() {
        if (_running) {
            _okToRun = false;
        }
    }


    // Register the command -- The command and the command title are kept together
    CommandManager.register("Start Flame Thrower", START_COMMANDID, throwFlames);
    CommandManager.register("Stop Flame Thrower", STOP_COMMANDID, extinguishFlames);
    // Add a new menu before the help menu.
    //  if you want to modify an existing menu you would use Menus.getMenu -- e.g. Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    var menu = Menus.addMenu("Flame", MY_MENUID, Menus.BEFORE, Menus.AppMenuBar.HELP_MENU);
    // Now add the menu item to invoke it.  Add a keyboard shortcut as well.
    menu.addMenuItem(START_COMMANDID);
    menu.addMenuItem(STOP_COMMANDID, KeyboardPrefs.stopThrowingFlames);
});

import assert from "../lib/assert";
import {
  BrowserWindow,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
} from "electron";

import { IPC_CHANNEL_RENDERER, getSimpleIpcNotifier } from "../electron";

enum MENU_ID {
  GAME = "game",
  HELP = "help",
}

enum GAME_MENU_ID {
  BEST_TIMES = "best_times",
  CONFIG_COLOR = "config_color",
  CONFIG_MARKS = "config_marks",
  CONFIG_SOUND = "config_sound",
  DIFFICULTY_BEGINNER = "diff_beginner",
  DIFFICULTY_CUSTOM = "diff_custom",
  DIFFICULTY_INTERMEDIATE = "diff_intermediate",
  DIFFICULTY_EXPERT = "diff_expert",
  EXIT = "exit",
  NEW = "new",
}

function uncheckMenuItem(menu: Menu, id: string) {
  const menuItem = menu.items.find((item) => item.id === id);

  assert(menuItem, `Menu item not found: "${id}"`);
  assert(
    menuItem.type === "checkbox" || menuItem.type === "radio",
    `Invalid menu item type: ${menuItem.type}`
  );

  menuItem.checked = false;
}

export function getMenuTemplate(
  window: BrowserWindow
): MenuItemConstructorOptions[] {
  function getDifficultyClickHandler(id: GAME_MENU_ID, channel: IPC_CHANNEL_RENDERER) {
    return (menuItem: MenuItem) => {
      const gameMenu = Menu.getApplicationMenu()?.items.find(
        ({ id }) => id === MENU_ID.GAME
      )?.submenu;

      assert(gameMenu, "No game menu found!");

      /**
       * Okay... So the menu in the XP version of Minesweeper PRESENTS the
       *  difficulty options as checkboxes but TREATS them as radio buttons.
       *  Since Electron actually treats checkboxes like checkboxes, we need to
       *  manually ensure the user can't "turn off" the difficulty option.
       */
      if (!menuItem.checked) {
        /**
         * NOTE: This click handler gets called AFTER the `checked` value has
         *  already been toggled.
         */
        menuItem.checked = true;
        return;
      }

      if (id !== GAME_MENU_ID.DIFFICULTY_BEGINNER)
        uncheckMenuItem(gameMenu, GAME_MENU_ID.DIFFICULTY_BEGINNER);
      if (id !== GAME_MENU_ID.DIFFICULTY_CUSTOM)
        uncheckMenuItem(gameMenu, GAME_MENU_ID.DIFFICULTY_CUSTOM);
      if (id !== GAME_MENU_ID.DIFFICULTY_EXPERT)
        uncheckMenuItem(gameMenu, GAME_MENU_ID.DIFFICULTY_EXPERT);
      if (id !== GAME_MENU_ID.DIFFICULTY_INTERMEDIATE)
        uncheckMenuItem(gameMenu, GAME_MENU_ID.DIFFICULTY_INTERMEDIATE);

      getSimpleIpcNotifier(window, channel)();
    };
  }

  return [
    /* Game Menu */
    {
      id: MENU_ID.GAME,
      label: "Game",
      submenu: [
        /* New */
        {
          accelerator: "F2",
          click: getSimpleIpcNotifier(window, IPC_CHANNEL_RENDERER.NEW_GAME),
          id: GAME_MENU_ID.NEW,
          label: "New",
        },

        // --------------------------------------------------------------------
        { type: "separator" },

        /* Difficulties */
        {
          checked: true,
          click: getDifficultyClickHandler(
            GAME_MENU_ID.DIFFICULTY_BEGINNER,
            IPC_CHANNEL_RENDERER.DIFFICULTY_BEGINNER
          ),
          id: GAME_MENU_ID.DIFFICULTY_BEGINNER,
          label: "Beginner",
          type: "checkbox",
        },
        {
          click: getDifficultyClickHandler(
            GAME_MENU_ID.DIFFICULTY_INTERMEDIATE,
            IPC_CHANNEL_RENDERER.DIFFICULTY_INTERMEDIATE
          ),
          id: GAME_MENU_ID.DIFFICULTY_INTERMEDIATE,
          label: "Intermediate",
          type: "checkbox",
        },
        {
          click: getDifficultyClickHandler(
            GAME_MENU_ID.DIFFICULTY_EXPERT,
            IPC_CHANNEL_RENDERER.DIFFICULTY_EXPERT
          ),
          id: GAME_MENU_ID.DIFFICULTY_EXPERT,
          label: "Expert",
          type: "checkbox",
        },
        {
          enabled: false,
          id: GAME_MENU_ID.DIFFICULTY_CUSTOM,
          label: "Custom...",
          type: "checkbox",
        },

        // --------------------------------------------------------------------
        { type: "separator" },

        /* Configuration Options */
        {
          checked: true,
          enabled: false,
          id: GAME_MENU_ID.CONFIG_MARKS,
          label: "Marks (?)",
          type: "checkbox",
        },
        {
          checked: true,
          enabled: false,
          id: GAME_MENU_ID.CONFIG_COLOR,
          label: "Color",
          type: "checkbox",
        },
        {
          enabled: false,
          id: GAME_MENU_ID.CONFIG_SOUND,
          label: "Sound",
          type: "checkbox",
        },

        // --------------------------------------------------------------------
        { type: "separator" },

        /* Best Times */
        {
          enabled: false,
          id: GAME_MENU_ID.BEST_TIMES,
          label: "Best Times...",
        },

        // --------------------------------------------------------------------
        { type: "separator" },

        /* Exit */
        {
          id: GAME_MENU_ID.EXIT,
          label: "Exit",
          role: "quit",
        },
      ],
    },

    /* Help Menu */
    {
      id: MENU_ID.HELP,
      label: "Help",
      submenu: [
        { label: "Contents", accelerator: "F1", enabled: false },
        { label: "Search for Help on...", enabled: false },
        { label: "Using Help", enabled: false },

        // --------------------------------------------------------------------
        { type: "separator" },

        { label: "About Minesweeper...", enabled: false },
      ],
    },
  ];
}

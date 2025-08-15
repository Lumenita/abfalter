import { renderTemplates } from "./renderTemplates.js";
import { templates } from "./templates.js";

const gmMacro = [
    {
        macroSelectorId: '#openSimpleCalc',
        hotkey: e => e.ctrlKey && e.key === '1',
        fn: () => window.Websocket.openSimpleCalc?.()
    },
    /*
    {
        macroSelectorId: '#sendAttack',
        hotkey: e => e.ctrlKey && e.key === '2',
        fn: () => window.Websocket.sendAttack?.()
    },
    */
    {
        macroSelectorId: '#kiCreator',
        hotkey: e => e.ctrlKey && e.key === '2',
        fn: () => window.Websocket.kiCreator?.()
    }

];
const playerMacro = [
    {
        macroSelectorId: '#openSimpleCalc',
        hotkey: e => e.ctrlKey && e.key === '1',
        fn: () => window.Websocket.openSimpleCalc?.()
    },
    /*
    {
        macroSelectorId: '#sendAttackRequest',
        hotkey: e => e.ctrlKey && e.key === '2',
        fn: () => window.Websocket.sendAttackRequest?.()
    }
    */
    {
        macroSelectorId: '#kiCreator',
        hotkey: e => e.ctrlKey && e.key === '2',
        fn: () => window.Websocket.kiCreator?.()
    }
];

export const customMacroBar = async () => {
    const gameCopy = game;
    const isGM = gameCopy.user?.isGM;
    const [customHotbarHTML] = await renderTemplates({
        name: templates.CustomHotBar,
        context: { isGM }
    });
    $('.system-abfalter').append(customHotbarHTML);

    const wrapper = document.querySelector(".customMacroWrapper");
    const dragHandle = wrapper.querySelector(".macroDragHandle");
    const toggleHandle = wrapper.querySelector(".macroToggleHandle");
    const arrow = wrapper.querySelector(".macroToggleArrow");
    const lockIcon = wrapper.querySelector(".macroLockHandle i");

    let isDragging = false;
    let isLocked = false;
    let offsetX = 0;
    let offsetY = 0;

    // Collapse toggle (arrow)
    toggleHandle.addEventListener("click", () => {
        if (isDragging) return;
        const isCollapsed = wrapper.classList.toggle("collapsed");
        arrow.style.transform = isCollapsed ? "rotate(180deg)" : "rotate(0deg)";
    });

    // Lock toggle
    document.querySelector(".macroLockHandle").addEventListener("click", () => {
        isLocked = !isLocked;
        lockIcon.classList.toggle("fa-lock");
        lockIcon.classList.toggle("fa-lock-open");
    });

    // Drag logic
    dragHandle.addEventListener("mousedown", (e) => {
        if (isLocked || e.button !== 0) return;
        isDragging = true;
        offsetX = e.clientX - wrapper.offsetLeft;
        offsetY = e.clientY - wrapper.offsetTop;
        document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        wrapper.style.left = `${e.clientX - offsetX}px`;
        wrapper.style.top = `${e.clientY - offsetY}px`;
        wrapper.style.bottom = "auto"; // disable bottom anchor
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        document.body.style.userSelect = "";
    });

    document.addEventListener("keydown", (e) => {
        if (!e.ctrlKey) return;

        const overlay = document.querySelector(".macroShortcutOverlay");
        overlay.innerHTML = "";

        const macros = document.querySelectorAll(".customMacro");
        macros.forEach((macro, i) => {
            const rect = macro.getBoundingClientRect();
            const label = document.createElement("div");
            label.classList.add("shortcut-float");
            label.textContent = `Ctrl + ${i + 1}`;

            // Position above the macro tile
            label.style.left = `${rect.left + rect.width / 2 - 27}px`;
            label.style.top = `${rect.top - 24}px`;

            overlay.appendChild(label);
        });
    });

    document.addEventListener("keyup", (e) => {
        if (e.key.toLowerCase() === "control") {
            document.querySelector(".macroShortcutOverlay").innerHTML = "";
        }
    });

    // Macro button logic
    const defaultMacroConfigs = isGM ? gmMacro : playerMacro;
    for (const config of defaultMacroConfigs) {
        if (config.macroSelectorId) {
            $(config.macroSelectorId).click(() => {
                config.fn();
            });
        }
    }
    document.addEventListener('keyup', () => {
        for (const config of defaultMacroConfigs) {
            if (config.macroSelectorId) {
                $(config.macroSelectorId).removeClass('hover');
            }
        }
    });
    document.addEventListener('keydown', e => {
        for (const config of defaultMacroConfigs) {
            if (e.ctrlKey && config.macroSelectorId) {
                $(config.macroSelectorId).addClass('hover');
            }
            if (config.hotkey(e)) {
                e.preventDefault();
                config.fn();
            }
        }
    });
}
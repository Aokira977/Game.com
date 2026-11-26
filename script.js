/* =====================================================
   PHANTOM: TERMINAL WARFARE
   JAVASCRIPT ENGINE V1.0
   Developer: Firmansyah
===================================================== */

"use strict";

/* =====================================================
   1. GAME CONFIGURATION
===================================================== */

const Game = {
    level: 1,
    task: 0,
    maxLevel: 5,
    running: false,
    paused: false,
    inDialog: false,
    bossMode: false,
    audioStarted: false,
    audioContext: null,
    musicTimer: null,

    player: {
        hp: 100,
        maxHP: 100,
        energy: 100,
        maxEnergy: 100,
        defense: 50
    },

    boss: {
        hp: 100,
        maxHP: 100,
        defense: 50
    },

    position: 22,
    keys: {},

    score: 0,
    completedLevels: [],

    settings: {
        music: true,
        sfx: true,
        musicVolume: 0.6,
        sfxVolume: 0.8
    }
};


/* =====================================================
   2. DOM HELPER
===================================================== */

const $ = id => document.getElementById(id);

const screens = [
    "loadingScreen",
    "mainMenu",
    "tutorialScreen",
    "settingsScreen",
    "gameScreen",
    "endingScreen"
];

function showScreen(id) {
    screens.forEach(screen => {
        const element = $(screen);
        if (element) element.classList.remove("active");
    });

    $(id)?.classList.add("active");
}

function showOverlay(id) {
    $(id)?.classList.remove("hidden");
}

function hideOverlay(id) {
    $(id)?.classList.add("hidden");
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}


/* =====================================================
   3. LOADING SYSTEM
===================================================== */

window.addEventListener("load", () => {
    let progress = 0;

    const loadingInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 12) + 5;
        progress = Math.min(progress, 100);

        $("loadingProgress").style.width = progress + "%";

        if (progress < 35) {
            $("loadingText").textContent = "Loading characters...";
        } else if (progress < 65) {
            $("loadingText").textContent = "Initializing terminal...";
        } else if (progress < 90) {
            $("loadingText").textContent = "Preparing missions...";
        } else {
            $("loadingText").textContent = "System ready.";
        }

        if (progress >= 100) {
            clearInterval(loadingInterval);

            setTimeout(() => {
                showScreen("mainMenu");
            }, 500);
        }

    }, 120);
});


/* =====================================================
   4. MISSION DATA
===================================================== */

const missions = {

    1: {
        name: "FIRST ACCESS",

        description:
            "Pelajari terminal Phantom dan periksa lingkungan server simulasi.",

        dialogues: [
            {
                speaker: "PHANTOM",
                avatar: "P",
                text: "Akhirnya... aku berhasil mengaktifkan terminal Phantom."
            },
            {
                speaker: "PHANTOM",
                avatar: "P",
                text: "Ada sebuah server simulasi yang perlu kuperiksa. Mari kita mulai."
            },
            {
                speaker: "SYSTEM",
                avatar: "S",
                text: "Selamat datang, Phantom. Ikuti petunjuk terminal untuk menyelesaikan misi."
            }
        ],

        tasks: [
            {
                title: "INITIALIZE TERMINAL",
                description: "Periksa daftar bantuan terminal.",

                hint: "Ketik command help untuk melihat perintah yang tersedia.",

                example: "help",

                commands: ["help"],

                response: [
                    "PHANTOM TERMINAL HELP",
                    "Available commands:",
                    "ls | scan | analyze | firewall",
                    "phantom.attack | phantom.defend"
                ]
            },

            {
                title: "SERVER DIRECTORY",
                description: "Lihat daftar file pada server simulasi.",

                hint: "Gunakan perintah ls untuk menampilkan daftar file.",

                example: "ls",

                commands: ["ls"],

                response: [
                    "DIRECTORY LIST:",
                    "server_data/",
                    "security.log",
                    "system_config.dat",
                    "ACCESS STATUS: SIMULATION ONLY"
                ]
            },

            {
                title: "SYSTEM SCAN",
                description: "Lakukan pemeriksaan terhadap sistem simulasi.",

                hint: "Ketik scan untuk menjalankan pemindaian simulasi.",

                example: "scan",

                commands: ["scan"],

                response: [
                    "SIMULATION SCAN COMPLETE.",
                    "Server condition: STABLE",
                    "Security status: PROTECTED",
                    "MISSION DATA: FOUND"
                ]
            }
        ]
    },


    2: {
        name: "SERVER INVESTIGATION",

        description:
            "Temukan petunjuk dan analisis konfigurasi sistem fiktif.",

        dialogues: [
            {
                speaker: "PHANTOM",
                avatar: "P",
                text: "Menarik. Ada beberapa file yang terlihat mencurigakan."
            },
            {
                speaker: "SYSTEM",
                avatar: "S",
                text: "Peringatan: ditemukan data konfigurasi yang belum dianalisis."
            },
            {
                speaker: "PHANTOM",
                avatar: "P",
                text: "Aku harus memeriksa setiap petunjuk sebelum melanjutkan."
            }
        ],

        tasks: [
            {
                title: "ANALYZE DATA",
                description: "Analisis data simulasi yang telah ditemukan.",

                hint: "Gunakan analyze data untuk membaca informasi simulasi.",

                example: "analyze data",

                commands: ["analyze data"],

                response: [
                    "ANALYSIS COMPLETE.",
                    "System integrity: 92%",
                    "Detected anomaly: 1",
                    "Threat level: LOW"
                ]
            },

            {
                title: "READ SECURITY LOG",
                description: "Baca catatan keamanan fiktif.",

                hint: "Ketik cat log untuk membaca catatan simulasi.",

                example: "cat log",

                commands: ["cat log"],

                response: [
                    "SECURITY LOG:",
                    "Unknown connection detected.",
                    "Origin: UNKNOWN",
                    "Status: MONITORED"
                ]
            },

            {
                title: "VERIFY SYSTEM",
                description: "Pastikan kondisi sistem tetap stabil.",

                hint: "Ketik verify system untuk memeriksa integritas sistem.",

                example: "verify system",

                commands: ["verify system"],

                response: [
                    "VERIFICATION SUCCESSFUL.",
                    "System integrity: VALID",
                    "All simulation checks passed."
                ]
            }
        ]
    },


    3: {
        name: "FIREWALL CHALLENGE",

        description:
            "Perkuat pertahanan Phantom dan selesaikan tantangan keamanan.",

        dialogues: [
            {
                speaker: "SYSTEM",
                avatar: "S",
                text: "Peringatan! Ada aktivitas mencurigakan di lingkungan simulasi."
            },
            {
                speaker: "PHANTOM",
                avatar: "P",
                text: "Kalau begitu aku akan memperkuat pertahananku."
            },
            {
                speaker: "PHANTOM",
                avatar: "P",
                text: "Tidak boleh ada celah dalam sistem pertahananku."
            }
        ],

        tasks: [
            {
                title: "BUILD FIREWALL",
                description: "Bangun lapisan pertahanan simulasi.",

                hint: "Ketik firewall untuk mengaktifkan perlindungan.",

                example: "firewall",

                commands: ["firewall"],

                response: [
                    "FIREWALL ACTIVATED.",
                    "Defense layer: ACTIVE",
                    "Security shield: READY"
                ]
            },

            {
                title: "STRENGTHEN DEFENSE",
                description: "Tingkatkan pertahanan Phantom.",

                hint: "Gunakan firewall strengthen untuk meningkatkan defense.",

                example: "firewall strengthen",

                commands: ["firewall strengthen"],

                response: [
                    "FIREWALL STRENGTHENED.",
                    "Defense reinforcement: SUCCESS",
                    "Protection increased."
                ],

                reward: {
                    defense: 20
                }
            },

            {
                title: "COUNTER ANALYSIS",
                description: "Analisis ancaman sebelum menghadapi lawan.",

                hint: "Ketik counter analyze untuk menjalankan analisis pertahanan.",

                example: "counter analyze",

                commands: ["counter analyze"],

                response: [
                    "COUNTER ANALYSIS COMPLETE.",
                    "Threat prediction: READY",
                    "Counter system: ENABLED"
                ]
            }
        ]
    },


    4: {
        name: "UNKNOWN HACKER",

        description:
            "Seseorang sedang mengamati aktivitas Phantom. Cari tahu identitasnya.",

        dialogues: [
            {
                speaker: "UNKNOWN",
                avatar: "?",
                text: "Kau semakin dekat, Phantom..."
            },
            {
                speaker: "PHANTOM",
                avatar: "P",
                text: "Siapa itu? Tunjukkan identitasmu!"
            },
            {
                speaker: "UNKNOWN",
                avatar: "?",
                text: "Kita akan bertemu sebentar lagi."
            },
            {
                speaker: "PHANTOM",
                avatar: "P",
                text: "Aku tidak akan mundur."
            }
        ],

        tasks: [
            {
                title: "TRACE UNKNOWN",
                description: "Periksa identitas koneksi misterius dalam simulasi.",

                hint: "Ketik trace unknown untuk mencari informasi identitas.",

                example: "trace unknown",

                commands: ["trace unknown"],

                response: [
                    "SIMULATED TRACE COMPLETE.",
                    "Identity: UNKNOWN",
                    "Alias: FIRMANN",
                    "Threat level: HIGH"
                ]
            },

            {
                title: "PREPARE COMBAT",
                description: "Siapkan sistem pertahanan untuk pertarungan.",

                hint: "Ketik combat prepare untuk mempersiapkan sistem.",

                example: "combat prepare",

                commands: ["combat prepare"],

                response: [
                    "COMBAT SYSTEM READY.",
                    "Energy: STABLE",
                    "Defense: READY",
                    "Battle preparation: COMPLETE"
                ]
            },

            {
                title: "FINAL VERIFICATION",
                description: "Verifikasi seluruh sistem sebelum pertarungan.",

                hint: "Ketik verify final untuk pemeriksaan terakhir.",

                example: "verify final",

                commands: ["verify final"],

                response: [
                    "FINAL VERIFICATION COMPLETE.",
                    "All systems operational.",
                    "WARNING: FINAL ENTITY APPROACHING."
                ]
            }
        ]
    }

};


/* =====================================================
   5. FINAL BOSS DATA
===================================================== */

const bossDialogues = [
    {
        speaker: "SYSTEM",
        avatar: "!",
        text: "WARNING! UNKNOWN ENTITY DETECTED."
    },
    {
        speaker: "FIRMANN",
        avatar: "F",
        text: "Jadi... kaulah Phantom yang selama ini membuat kekacauan di arena simulasi."
    },
    {
        speaker: "PHANTOM",
        avatar: "P",
        text: "Firmann. Akhirnya kita bertemu."
    },
    {
        speaker: "FIRMANN",
        avatar: "F",
        text: "Kau memiliki kemampuan yang menarik. Tapi pertahananmu belum tentu mampu menahan seranganku."
    },
    {
        speaker: "PHANTOM",
        avatar: "P",
        text: "Kita lihat saja siapa yang bertahan sampai akhir."
    },
    {
        speaker: "FIRMANN",
        avatar: "F",
        text: "Baiklah. Pertarungan dimulai!"
    }
];


/* =====================================================
   6. TERMINAL SYSTEM
===================================================== */

function terminalPrint(message, type = "system") {

    const output = $("terminalOutput");

    const line = document.createElement("p");

    line.className = "terminal-" + type;
    line.textContent = message;

    output.appendChild(line);

    output.scrollTop = output.scrollHeight;
}


function terminalCommandLine(command) {

    const line = document.createElement("p");

    line.style.color = "#8cae9d";
    line.textContent = "phantom@system:~$ " + command;

    $("terminalOutput").appendChild(line);

    $("terminalOutput").scrollTop =
        $("terminalOutput").scrollHeight;
}


function clearTerminal() {
    $("terminalOutput").innerHTML = "";
}


function normalizeCommand(value) {
    return value.trim().toLowerCase().replace(/\s+/g, " ");
}


/* =====================================================
   7. MISSION INTERFACE
===================================================== */

function updateMission() {

    const data = missions[Game.level];

    if (!data) return;

    const current = data.tasks[Game.task];

    if (!current) return;

    $("levelNumber").textContent =
        "LEVEL " + String(Game.level).padStart(2, "0");

    $("levelName").textContent = data.name;

    $("missionTitle").textContent = current.title;

    $("missionDescription").textContent =
        current.description;

    $("missionHint").textContent =
        current.hint;

    $("commandExample").textContent =
        current.example;

    $("missionProgress").textContent =
        (Game.task + 1) + "/" + data.tasks.length;

    $("terminalPrompt").textContent =
        "phantom@system:~$";

    $("terminalInput").placeholder =
        "Type your command...";

    $("terminalInput").disabled = false;
    $("executeCommandBtn").disabled = false;

    $("terminalInput").focus();
}


/* =====================================================
   8. DIALOG SYSTEM
===================================================== */

let currentDialogues = [];
let dialogIndex = 0;
let afterDialog = null;

function startDialog(dialogues, callback) {

    currentDialogues = dialogues;
    dialogIndex = 0;
    afterDialog = callback;

    Game.inDialog = true;

    showOverlay("dialogBox");

    displayDialog();
}


function displayDialog() {

    const dialogue = currentDialogues[dialogIndex];

    if (!dialogue) return;

    $("dialogSpeaker").textContent =
        dialogue.speaker;

    $("dialogAvatar").textContent =
        dialogue.avatar;

    $("dialogText").textContent =
        dialogue.text;

    $("dialogChapter").textContent =
        "CHAPTER " + String(Game.level).padStart(2, "0");

    $("nextDialogBtn").textContent =
        dialogIndex === currentDialogues.length - 1
            ? "CONTINUE ▶"
            : "NEXT ▶";
}


$("nextDialogBtn").addEventListener("click", () => {

    if (!Game.inDialog) return;

    dialogIndex++;

    if (dialogIndex < currentDialogues.length) {
        displayDialog();
    } else {

        hideOverlay("dialogBox");

        Game.inDialog = false;

        const callback = afterDialog;
        afterDialog = null;

        if (callback) callback();
    }
});


/* =====================================================
   9. START LEVEL
===================================================== */

function startLevel(level) {

    Game.level = level;
    Game.task = 0;
    Game.bossMode = false;

    Game.running = true;
    Game.paused = false;

    hideOverlay("pauseScreen");
    hideOverlay("levelCompleteScreen");
    hideOverlay("gameOverScreen");
    hideOverlay("bossAnnouncement");

    $("bossStatus").classList.add("hidden");
    $("firmannCharacter").classList.add("hidden");

    showScreen("gameScreen");

    $("phantomCharacter").style.left =
        Game.position + "%";

    clearTerminal();

    terminalPrint("PHANTOM OS [Version 2.0]", "info");

    terminalPrint("Mission initialized.", "success");

    terminalPrint(
        "Type the command shown in the mission hint.",
        "system"
    );

    if (level === 5) {
        startBoss();
        return;
    }

    const data = missions[level];

    if (!data) return;

    startDialog(data.dialogues, () => {
        updateMission();
    });
}


/* =====================================================
   10. COMPLETE TASK
===================================================== */

function completeTask() {

    const data = missions[Game.level];

    const current = data.tasks[Game.task];

    terminalPrint("COMMAND ACCEPTED.", "success");

    current.response.forEach((message, index) => {

        setTimeout(() => {
            terminalPrint(message, "info");
            soundBeep(700 + index * 80);
        }, index * 180);

    });

    if (current.reward) {

        if (current.reward.defense) {
            Game.player.defense += current.reward.defense;
        }

        updateStatus();
    }

    Game.score += 100;

    setTimeout(() => {

        Game.task++;

        if (Game.task >= data.tasks.length) {
            completeLevel();
        } else {
            updateMission();
            terminalPrint("NEXT OBJECTIVE UNLOCKED.", "success");
            playSfx("success");
        }

    }, current.response.length * 180 + 400);
}


/* =====================================================
   11. COMMAND VALIDATION
===================================================== */

let commandLocked = false;

function executeCommand(rawCommand) {

    if (!Game.running ||
        Game.paused ||
        Game.inDialog ||
        commandLocked) return;

    const command = normalizeCommand(rawCommand);

    if (!command) return;

    terminalCommandLine(command);

    $("terminalInput").value = "";

    playTypingSound();

    if (Game.bossMode) {
        executeBossCommand(command);
        return;
    }

    const data = missions[Game.level];

    if (!data) return;

    const current = data.tasks[Game.task];

    if (!current) return;

    // Bantuan tambahan tanpa mengubah progres.

    if (command === "clear") {
        clearTerminal();
        return;
    }

    if (command === "hint") {
        terminalPrint(
            "HINT: " + current.hint,
            "info"
        );
        return;
    }

    if (command === "example") {
        terminalPrint(
            "EXAMPLE: " + current.example,
            "success"
        );
        return;
    }

    // Pemeriksaan command misi.

    if (current.commands.includes(command)) {

        commandLocked = true;

        terminalPrint("PROCESSING...", "info");

        setTimeout(() => {
            completeTask();
            commandLocked = false;
        }, 350);

    } else {

        terminalPrint(
            "COMMAND NOT RECOGNIZED.",
            "error"
        );

        terminalPrint(
            "Read the mission hint and try again.",
            "system"
        );

        playSfx("error");
    }
}


$("terminalForm").addEventListener("submit", event => {

    event.preventDefault();

    executeCommand($("terminalInput").value);

});


/* =====================================================
   12. COMPLETE LEVEL
===================================================== */

function completeLevel() {

    Game.running = false;

    Game.completedLevels.push(Game.level);

    saveProgress();

    playSfx("success");

    $("levelCompleteText").textContent =
        missions[Game.level].name +
        " successfully completed.";

    showOverlay("levelCompleteScreen");
}


$("nextLevelBtn").addEventListener("click", () => {

    hideOverlay("levelCompleteScreen");

    const next = Game.level + 1;

    if (next <= 5) {
        startLevel(next);
    }

});


/* =====================================================
   13. BOSS INTRODUCTION
===================================================== */

function startBoss() {

    Game.bossMode = false;

    Game.player.hp = 100;
    Game.player.energy = 100;
    Game.player.defense = 70;

    Game.boss.hp = 100;
    Game.boss.defense = 65;

    Game.position = 20;

    $("phantomCharacter").style.left = "20%";
    $("firmannCharacter").style.left = "72%";

    $("bossStatus").classList.remove("hidden");
    $("firmannCharacter").classList.remove("hidden");

    updateStatus();

    hideOverlay("bossAnnouncement");

    playBossMusic();

    showOverlay("bossAnnouncement");

    playSfx("alarm");

    setTimeout(() => {

        hideOverlay("bossAnnouncement");

        startDialog(bossDialogues, () => {

            Game.bossMode = true;
            Game.running = true;

            $("missionTitle").textContent =
                "FINAL BATTLE";

            $("missionDescription").textContent =
                "Kalahkan Firmann menggunakan strategi serangan dan pertahanan.";

            $("missionHint").textContent =
                "Pilih phantom.attack pulse untuk menyerang atau phantom.defend untuk bertahan.";

            $("commandExample").textContent =
                "phantom.attack pulse";

            $("missionProgress").textContent =
                "FINAL BOSS";

            clearTerminal();

            terminalPrint(
                "FINAL BATTLE INITIALIZED.",
                "info"
            );

            terminalPrint(
                "PHANTOM VS FIRMANN",
                "success"
            );

            terminalPrint(
                "Available: phantom.attack pulse",
                "system"
            );

            terminalPrint(
                "Available: phantom.defend",
                "system"
            );

            terminalPrint(
                "Available: phantom.recharge",
                "system"
            );

            $("terminalInput").focus();

        });

    }, 2200);
}


/* =====================================================
   14. FINAL BOSS COMMAND SYSTEM
===================================================== */

let bossTurn = 0;

function executeBossCommand(command) {

    if (!Game.bossMode || !Game.running) return;

    if (commandLocked) return;

    const actions = {

        "phantom.attack pulse": "attack",

        "phantom.defend": "defend",

        "phantom.recharge": "recharge"

    };

    const action = actions[command];

    if (!action) {

        terminalPrint(
            "UNKNOWN COMBAT COMMAND.",
            "error"
        );

        terminalPrint(
            "Try: phantom.attack pulse",
            "info"
        );

        terminalPrint(
            "Or: phantom.defend / phantom.recharge",
            "info"
        );

        return;
    }

    commandLocked = true;

    if (action === "attack") {

        if (Game.player.energy < 15) {

            terminalPrint(
                "ENERGY TOO LOW. RECHARGE FIRST.",
                "error"
            );

            commandLocked = false;
            return;
        }

        Game.player.energy -= 15;

        const damage = 22;

        Game.boss.hp = Math.max(
            0,
            Game.boss.hp - damage
        );

        terminalPrint(
            "PHANTOM DIGITAL PULSE ACTIVATED.",
            "success"
        );

        terminalPrint(
            "FIRMANN RECEIVED " + damage + " DAMAGE.",
            "info"
        );

        attackAnimation();

        playSfx("attack");

    }

    else if (action === "defend") {

        Game.player.defense = Math.min(
            100,
            Game.player.defense + 25
        );

        terminalPrint(
            "PHANTOM SHIELD ACTIVATED.",
            "success"
        );

        terminalPrint(
            "DEFENSE REINFORCED.",
            "info"
        );

        playSfx("defense");

    }

    else if (action === "recharge") {

        Game.player.energy = Math.min(
            100,
            Game.player.energy + 35
        );

        terminalPrint(
            "ENERGY RECHARGED.",
            "success"
        );

        playSfx("success");

    }

    updateStatus();

    if (Game.boss.hp <= 0) {

        commandLocked = false;

        winBossBattle();
        return;
    }

    setTimeout(() => {

        bossAttack();

        commandLocked = false;

    }, 900);

}


/* =====================================================
   15. BOSS COUNTERATTACK
===================================================== */

function bossAttack() {

    if (!Game.bossMode || !Game.running) return;

    bossTurn++;

    const randomAttack = bossTurn % 3;

    if (randomAttack === 0) {

        const damage = 18;

        Game.player.hp = Math.max(
            0,
            Game.player.hp - damage
        );

        terminalPrint(
            "FIRMANN: DIGITAL STRIKE!",
            "error"
        );

        terminalPrint(
            "PHANTOM RECEIVED " + damage + " DAMAGE.",
            "error"
        );

        damageAnimation();
        playSfx("attack");

    } else if (randomAttack === 1) {

        Game.boss.defense = Math.min(
            100,
            Game.boss.defense + 15
        );

        terminalPrint(
            "FIRMANN: FIREWALL REINFORCED.",
            "info"
        );

        terminalPrint(
            "ENEMY DEFENSE INCREASED.",
            "system"
        );

        playSfx("defense");

    } else {

        const damage = 12;

        Game.player.hp = Math.max(
            0,
            Game.player.hp - damage
        );

        terminalPrint(
            "FIRMANN: COUNTER ATTACK!",
            "error"
        );

        terminalPrint(
            "PHANTOM RECEIVED " + damage + " DAMAGE.",
            "error"
        );

        damageAnimation();
        playSfx("attack");
    }

    updateStatus();

    if (Game.player.hp <= 0) {
        gameOver();
    }

}


/* =====================================================
   16. ATTACK ANIMATION
===================================================== */

function attackAnimation() {

    const effects = $("attackEffects");

    const projectile = document.createElement("div");

    projectile.className = "attack-projectile";

    projectile.style.left = "28%";
    projectile.style.top = "50%";

    effects.appendChild(projectile);

    setTimeout(() => {

        projectile.remove();

        const impact = document.createElement("div");

        impact.className = "attack-effect";

        impact.style.left = "70%";
        impact.style.top = "45%";

        effects.appendChild(impact);

        setTimeout(() => impact.remove(), 500);

    }, 400);

    $("screenFlash").classList.remove("flash");

    void $("screenFlash").offsetWidth;

    $("screenFlash").classList.add("flash");

}


function damageAnimation() {

    const overlay = $("damageOverlay");

    overlay.classList.remove("damaged");

    void overlay.offsetWidth;

    overlay.classList.add("damaged");
}


/* =====================================================
   17. BOSS VICTORY
===================================================== */

function winBossBattle() {

    Game.running = false;
    Game.bossMode = false;

    Game.score += 1000;

    Game.completedLevels.push(5);

    saveProgress();

    stopBossMusic();

    playSfx("victory");

    terminalPrint(
        "FIRMANN DEFEATED.",
        "success"
    );

    terminalPrint(
        "FINAL BATTLE COMPLETED.",
        "success"
    );

    setTimeout(() => {

        startDialog([
            {
                speaker: "FIRMANN",
                avatar: "F",
                text: "Aku akui... strategimu memang hebat, Phantom."
            },
            {
                speaker: "PHANTOM",
                avatar: "P",
                text: "Pertarungan yang bagus, Firmann."
            },
            {
                speaker: "FIRMANN",
                avatar: "F",
                text: "Sampai jumpa lagi, Phantom."
            },
            {
                speaker: "SYSTEM",
                avatar: "S",
                text: "ALL MISSIONS COMPLETED. VICTORY!"
            }
        ], () => {

            setTimeout(() => {
                showEnding();
            }, 1000);

        });

    }, 1000);
}


/* =====================================================
   18. GAME OVER
===================================================== */

function gameOver() {

    Game.running = false;
    Game.bossMode = false;

    stopBossMusic();

    playSfx("error");

    showOverlay("gameOverScreen");
}


$("retryGameBtn").addEventListener("click", () => {

    Game.player.hp = 100;
    Game.player.energy = 100;
    Game.player.defense = 70;

    startLevel(5);

});


$("gameOverMenuBtn").addEventListener("click", () => {

    hideOverlay("gameOverScreen");

    stopBossMusic();

    showScreen("mainMenu");

});


/* =====================================================
   19. CHARACTER MOVEMENT
===================================================== */

function moveCharacter(direction) {

    if (!Game.running || Game.paused || Game.inDialog) return;

    Game.position += direction * 2;

    Game.position = clamp(
        Game.position,
        3,
        85
    );

    $("phantomCharacter").style.left =
        Game.position + "%";

    $("phantomCharacter").classList.add("moving");

    setTimeout(() => {
        $("phantomCharacter").classList.remove("moving");
    }, 250);
}


function holdMovement(button, direction) {

    let interval = null;

    const start = event => {

        event.preventDefault();

        if (interval) return;

        moveCharacter(direction);

        interval = setInterval(() => {
            moveCharacter(direction);
        }, 110);

    };

    const stop = () => {

        clearInterval(interval);
        interval = null;

    };

    button.addEventListener("pointerdown", start);
    button.addEventListener("pointerup", stop);
    button.addEventListener("pointerleave", stop);
    button.addEventListener("pointercancel", stop);

}


holdMovement($("moveLeft"), -1);
holdMovement($("moveRight"), 1);


$("jumpButton").addEventListener("click", () => {

    if (!Game.running || Game.paused) return;

    const character = $("phantomCharacter");

    character.style.transition = "transform .2s";
    character.style.transform = "translateY(-45px)";

    setTimeout(() => {
        character.style.transform = "";
    }, 350);

    playSfx("jump");

});


/* =====================================================
   20. KEYBOARD CONTROLS
===================================================== */

document.addEventListener("keydown", event => {

    if (Game.paused || Game.inDialog) return;

    if (
        event.target === $("terminalInput") ||
        event.target.tagName === "INPUT"
    ) return;

    if (event.key === "ArrowLeft" || event.key === "a") {
        moveCharacter(-1);
    }

    if (event.key === "ArrowRight" || event.key === "d") {
        moveCharacter(1);
    }

    if (event.key === " " && Game.running) {
        $("jumpButton").click();
    }

});


/* =====================================================
   21. VIRTUAL KEYBOARD
===================================================== */

document.querySelectorAll("#virtualKeyboard button")
.forEach(button => {

    button.addEventListener("click", () => {

        const key = button.dataset.key;

        const input = $("terminalInput");

        if (!input || input.disabled) return;

        if (key === "Backspace") {

            input.value = input.value.slice(0, -1);

        } else if (key === "Enter") {

            $("terminalForm").requestSubmit();

        } else {

            input.value += key;

        }

        input.focus();

        playTypingSound();

    });

});


/* =====================================================
   22. STATUS UPDATE
===================================================== */

function updateStatus() {

    const p = Game.player;
    const b = Game.boss;

    $("phantomHP").textContent = p.hp;
    $("phantomEnergy").textContent = p.energy;
    $("phantomDefense").textContent = p.defense;

    $("phantomHPBar").style.width =
        (p.hp / p.maxHP * 100) + "%";

    $("phantomEnergyBar").style.width =
        (p.energy / p.maxEnergy * 100) + "%";

    $("phantomDefenseBar").style.width =
        clamp(p.defense, 0, 100) + "%";

    $("firmannHP").textContent = b.hp;
    $("firmannDefense").textContent = b.defense;

    $("firmannHPBar").style.width =
        (b.hp / b.maxHP * 100) + "%";

    $("firmannDefenseBar").style.width =
        clamp(b.defense, 0, 100) + "%";

}


/* =====================================================
   23. AUDIO ENGINE
===================================================== */

function initAudio() {

    if (Game.audioContext) return;

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContext) return;

    Game.audioContext = new AudioContext();

}


function playTone(frequency, duration, type = "sine", volume = 0.08) {

    if (!Game.settings.sfx) return;

    initAudio();

    if (!Game.audioContext) return;

    const ctx = Game.audioContext;

    if (ctx.state === "suspended") {
        ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = type;

    oscillator.frequency.setValueAtTime(
        frequency,
        ctx.currentTime
    );

    gain.gain.setValueAtTime(
        volume * Game.settings.sfxVolume,
        ctx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);

}


function soundBeep(frequency = 600) {
    playTone(frequency, 0.12, "sine", 0.04);
}


function playTypingSound() {
    playTone(450 + Math.random() * 250, 0.035, "square", 0.025);
}


function playSfx(type) {

    if (!Game.settings.sfx) return;

    switch (type) {

        case "success":
            playTone(550, .12, "sine");
            setTimeout(() => playTone(850, .2), 100);
            break;

        case "error":
            playTone(150, .3, "sawtooth");
            break;

        case "attack":
            playTone(130, .2, "sawtooth", .13);
            setTimeout(() => playTone(70, .3, "square", .1), 100);
            break;

        case "defense":
            playTone(400, .3, "sine", .09);
            setTimeout(() => playTone(750, .25, "sine", .08), 150);
            break;

        case "alarm":
            playTone(900, .3, "square", .1);
            setTimeout(() => playTone(500, .3, "square", .1), 300);
            setTimeout(() => playTone(900, .3, "square", .1), 600);
            break;

        case "victory":
            playTone(500, .3);
            setTimeout(() => playTone(650, .3), 200);
            setTimeout(() => playTone(850, .5), 400);
            break;

        case "jump":
            playTone(350, .12, "sine");
            break;
    }

}


/* =====================================================
   24. BACKGROUND MUSIC
===================================================== */

let musicOscillators = [];
let musicGain = null;

function startSynthMusic(boss = false) {

    initAudio();

    if (!Game.audioContext) return;

    stopSynthMusic();

    const ctx = Game.audioContext;

    const gain = ctx.createGain();

    gain.gain.value =
        Game.settings.musicVolume * (boss ? 0.035 : 0.018);

    gain.connect(ctx.destination);

    musicGain = gain;

    const notes = boss
        ? [55, 65, 73, 55, 82, 73, 65, 49]
        : [110, 165, 220, 165, 130, 196, 220, 165];

    let index = 0;

    const playNote = () => {

        if (!Game.settings.music || !musicGain) return;

        const oscillator = ctx.createOscillator();

        oscillator.type = boss ? "sawtooth" : "triangle";

        oscillator.frequency.value = notes[index % notes.length];

        const noteGain = ctx.createGain();

        noteGain.gain.value = boss ? 0.22 : 0.12;

        oscillator.connect(noteGain);
        noteGain.connect(gain);

        oscillator.start();

        oscillator.stop(ctx.currentTime + (boss ? 0.32 : 0.5));

        musicOscillators.push(oscillator);

        index++;

    };

    playNote();

    Game.musicTimer = setInterval(
        playNote,
        boss ? 350 : 550
    );

}


function stopSynthMusic() {

    if (Game.musicTimer) {
        clearInterval(Game.musicTimer);
        Game.musicTimer = null;
    }

    musicOscillators.forEach(oscillator => {
        try {
            oscillator.stop();
        } catch (e) {}
    });

    musicOscillators = [];

    if (musicGain) {
        musicGain.disconnect();
        musicGain = null;
    }

}


function playBackgroundMusic() {

    if (!Game.settings.music) return;

    const audio = $("backgroundMusic");

    audio.volume = Game.settings.musicVolume;

    audio.play().catch(() => {
        startSynthMusic(false);
    });

}


function playBossMusic() {

    stopSynthMusic();

    $("backgroundMusic").pause();

    const bossAudio = $("bossMusic");

    bossAudio.volume = Game.settings.musicVolume;

    bossAudio.currentTime = 0;

    bossAudio.play().catch(() => {
        startSynthMusic(true);
    });

}


function stopBossMusic() {

    $("bossMusic").pause();

    $("bossMusic").currentTime = 0;

    stopSynthMusic();

    if (Game.settings.music) {
        playBackgroundMusic();
    }

}


/* =====================================================
   25. MUSIC SETTINGS
===================================================== */

$("musicVolume").addEventListener("input", event => {

    Game.settings.musicVolume =
        Number(event.target.value) / 100;

    $("backgroundMusic").volume =
        Game.settings.musicVolume;

    $("bossMusic").volume =
        Game.settings.musicVolume;

});


$("sfxVolume").addEventListener("input", event => {

    Game.settings.sfxVolume =
        Number(event.target.value) / 100;

});


$("musicToggle").addEventListener("change", event => {

    Game.settings.music = event.target.checked;

    if (!Game.settings.music) {

        $("backgroundMusic").pause();
        $("bossMusic").pause();
        stopSynthMusic();

    } else if (Game.bossMode) {

        playBossMusic();

    } else {

        playBackgroundMusic();

    }

});


$("sfxToggle").addEventListener("change", event => {

    Game.settings.sfx = event.target.checked;

});


/* =====================================================
   26. MAIN MENU BUTTONS
===================================================== */

$("startGameBtn").addEventListener("click", () => {

    initAudio();

    Game.player.hp = 100;
    Game.player.energy = 100;
    Game.player.defense = 50;

    Game.score = 0;
    Game.completedLevels = [];

    Game.position = 22;

    playBackgroundMusic();

    startLevel(1);

});


$("continueGameBtn").addEventListener("click", () => {

    const saved = loadProgress();

    if (saved && saved.level) {

        initAudio();
        playBackgroundMusic();

        Game.player.hp = 100;
        Game.player.energy = 100;

        startLevel(
            Math.min(saved.level, 5)
        );

    } else {

        terminalPrint(
            "NO SAVED PROGRESS FOUND.",
            "error"
        );

    }

});


$("howToPlayBtn").addEventListener("click", () => {
    showScreen("tutorialScreen");
});


$("settingsBtn").addEventListener("click", () => {
    showScreen("settingsScreen");
});


document.querySelectorAll(".back-menu-btn")
.forEach(button => {

    button.addEventListener("click", () => {
        showScreen("mainMenu");
    });

});


/* =====================================================
   27. PAUSE SYSTEM
===================================================== */

$("pauseGameBtn").addEventListener("click", () => {

    if (!Game.running || Game.inDialog) return;

    Game.paused = true;

    showOverlay("pauseScreen");

});


$("resumeGameBtn").addEventListener("click", () => {

    Game.paused = false;

    hideOverlay("pauseScreen");

    $("terminalInput").focus();

});


$("restartLevelBtn").addEventListener("click", () => {

    hideOverlay("pauseScreen");

    Game.paused = false;

    Game.player.hp = 100;
    Game.player.energy = 100;

    startLevel(Game.level);

});


$("exitGameBtn").addEventListener("click", () => {

    Game.running = false;
    Game.paused = false;

    hideOverlay("pauseScreen");

    stopBossMusic();

    showScreen("mainMenu");

});


/* =====================================================
   28. COPY COMMAND
===================================================== */

$("copyCommandBtn").addEventListener("click", async () => {

    const command = $("commandExample").textContent;

    try {

        await navigator.clipboard.writeText(command);

        $("copyCommandBtn").textContent = "COPIED!";

        setTimeout(() => {
            $("copyCommandBtn").textContent = "COPY";
        }, 1200);

    } catch (error) {

        $("copyCommandBtn").textContent = "COPY FAILED";

    }

});


/* =====================================================
   29. SAVE PROGRESS
===================================================== */

function saveProgress() {

    const data = {
        level: Game.level,
        score: Game.score,
        completedLevels: Game.completedLevels
    };

    localStorage.setItem(
        "phantom_terminal_save",
        JSON.stringify(data)
    );

}


function loadProgress() {

    try {

        const data = localStorage.getItem(
            "phantom_terminal_save"
        );

        if (!data) return null;

        return JSON.parse(data);

    } catch (error) {

        return null;

    }

}


/* =====================================================
   30. FINAL ENDING
===================================================== */

function showEnding() {

    Game.running = false;
    Game.bossMode = false;

    stopBossMusic();

    showScreen("endingScreen");

    playSfx("victory");

}


$("endingReplayBtn").addEventListener("click", () => {

    hideOverlay("bossAnnouncement");

    stopBossMusic();

    Game.player.hp = 100;
    Game.player.energy = 100;
    Game.player.defense = 50;

    Game.score = 0;
    Game.completedLevels = [];

    Game.position = 22;

    playBackgroundMusic();

    startLevel(1);

});


/* =====================================================
   31. AUTO SAVE AND INITIALIZATION
===================================================== */

updateStatus();

console.log(
    "%cPHANTOM TERMINAL WARFARE",
    "color:#00c8ff;font-size:20px;font-weight:bold"
);

console.log(
    "%cGame engine initialized.",
    "color:#00ff9d;font-size:12px"
);

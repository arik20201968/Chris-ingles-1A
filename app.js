// ==========================================================================
// CURSO INTERACTIVO DE INGLÉS A1 — APP CONTROLLER & LOGIC
// ==========================================================================

// Estado de la aplicación
let currentModule = 0;
let currentLesson = 0;
let completedLessons = new Set();
let openModules = new Set([0]); // Módulo 0 abierto por defecto
let searchQuery = '';
let currentSpeechUtterance = null;

// --------------------------------------------------------------------------
// 1. GESTIÓN DE TEMA (Modo Claro / Oscuro)
// --------------------------------------------------------------------------
function initTheme() {
    const savedTheme = localStorage.getItem('courseTheme') || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('courseTheme', theme);
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
        icon.title = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
}

// --------------------------------------------------------------------------
// 2. GESTIÓN DE PROGRESO (LocalStorage)
// --------------------------------------------------------------------------
function loadProgress() {
    try {
        const saved = localStorage.getItem('courseProgress');
        if (saved) {
            completedLessons = new Set(JSON.parse(saved));
        }
    } catch (e) {
        console.error('Error al cargar progreso:', e);
        completedLessons = new Set();
    }
}

function saveProgress() {
    try {
        localStorage.setItem('courseProgress', JSON.stringify([...completedLessons]));
    } catch (e) {
        console.error('Error al guardar progreso:', e);
    }
    updateProgressBar();
    updateTotalLessonsBadge();
}

function getTotalLessonsCount() {
    return lessonsData.reduce((sum, mod) => sum + mod.lessons.length, 0);
}

function updateProgressBar() {
    const total = getTotalLessonsCount();
    const completed = completedLessons.size;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const bar = document.getElementById('progressBar');
    const text = document.getElementById('progressText');
    const track = document.querySelector('.progress-bar-track');

    if (bar) bar.style.width = percentage + '%';
    if (text) {
        text.textContent = percentage + '%';
        text.setAttribute('aria-label', `Progreso del curso: ${percentage} por ciento completado`);
    }
    
    // Actualizar progressbar ARIA
    if (track) {
        track.setAttribute('aria-valuenow', percentage);
        track.setAttribute('aria-label', `Progreso del curso: ${completed} de ${total} lecciones completadas`);
    }
}

function updateTotalLessonsBadge() {
    const total = getTotalLessonsCount();
    const completed = completedLessons.size;
    const badge = document.getElementById('totalLessonsBadge');
    if (badge) {
        badge.textContent = `${completed}/${total}`;
    }
}

function getModuleProgress(moduleIndex) {
    const module = lessonsData[moduleIndex];
    if (!module) return '0/0';
    let count = 0;
    module.lessons.forEach((_, lIndex) => {
        if (completedLessons.has(`${moduleIndex}-${lIndex}`)) {
            count++;
        }
    });
    return `${count}/${module.lessons.length}`;
}

// --------------------------------------------------------------------------
// 3. MOTOR DE VOZ Y PRONUNCIACIÓN (Web Speech API TTS) - MEJORADO
// --------------------------------------------------------------------------

// Variable global para cachear voces
let cachedEnglishVoices = [];
let voicesLoaded = false;

// Función mejorada para cargar y cachear voces en inglés
function loadVoices() {
    return new Promise((resolve) => {
        const voices = window.speechSynthesis.getVoices();
        
        if (voices.length > 0) {
            // Filtrar y priorizar voces en inglés
            cachedEnglishVoices = voices.filter(v => 
                v.lang.startsWith('en-') || 
                v.lang.startsWith('en_') || 
                v.lang === 'en'
            ).sort((a, b) => {
                // Priorizar voces de calidad
                const priorityA = getPriorityScore(a);
                const priorityB = getPriorityScore(b);
                return priorityB - priorityA;
            });
            
            voicesLoaded = true;
            console.log(`✅ ${cachedEnglishVoices.length} voces en inglés cargadas`);
            resolve(cachedEnglishVoices);
        } else {
            resolve([]);
        }
    });
}

// Función para calcular prioridad de voces
function getPriorityScore(voice) {
    let score = 0;
    
    // Priorizar voces estadounidenses y británicas
    if (voice.lang === 'en-US') score += 50;
    else if (voice.lang === 'en-GB') score += 45;
    else if (voice.lang.startsWith('en-')) score += 30;
    
    // Priorizar voces premium/naturales
    const name = voice.name.toLowerCase();
    if (name.includes('google')) score += 20;
    if (name.includes('natural') || name.includes('premium')) score += 15;
    if (name.includes('enhanced')) score += 10;
    
    // Voces específicas de calidad
    if (name.includes('samantha')) score += 25; // macOS
    if (name.includes('karen')) score += 25; // macOS
    if (name.includes('daniel')) score += 25; // macOS
    if (name.includes('zira')) score += 20; // Windows
    if (name.includes('david')) score += 20; // Windows
    
    // Evitar voces compactas/básicas
    if (name.includes('compact') || name.includes('basic')) score -= 10;
    
    return score;
}

// Obtener la mejor voz en inglés
function getEnglishVoice() {
    if (!('speechSynthesis' in window)) return null;
    
    // Si no hay voces cargadas, intentar cargar
    if (cachedEnglishVoices.length === 0) {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            cachedEnglishVoices = voices.filter(v => 
                v.lang.startsWith('en-') || 
                v.lang.startsWith('en_') || 
                v.lang === 'en'
            ).sort((a, b) => getPriorityScore(b) - getPriorityScore(a));
        }
    }
    
    // Retornar la mejor voz disponible
    return cachedEnglishVoices[0] || null;
}

// Cargar voces al inicializar
if ('speechSynthesis' in window) {
    // Cargar inmediatamente
    loadVoices();
    
    // Y también cuando cambien (algunos navegadores cargan asíncronamente)
    window.speechSynthesis.onvoiceschanged = () => {
        loadVoices().then(voices => {
            if (voices.length > 0) {
                console.log('🔊 Mejor voz en inglés:', voices[0].name, '(' + voices[0].lang + ')');
            }
        });
    };
    
    // Forzar carga inicial (workaround para algunos navegadores)
    setTimeout(() => {
        if (!voicesLoaded) {
            loadVoices();
        }
    }, 100);
}

// Función mejorada para reproducir texto en inglés
function speakText(rawText, btnElement = null) {
    if (!('speechSynthesis' in window)) {
        showNotification('La síntesis de voz no está disponible en tu navegador.', 'warning');
        return;
    }

    // Limpiar texto: remover traducciones en español y caracteres especiales
    let clean = rawText
        .replace(/\([^)]*español[^)]*\)/gi, '') // Quitar (en español) o (español)
        .replace(/\([^)]*\)/g, '') // Quitar otros paréntesis
        .replace(/\[[^\]]*\]/g, '') // Quitar corchetes
        .replace(/\{[^}]*\}/g, '') // Quitar llaves
        .replace(/[:\/—–•]/g, ' ') // Reemplazar puntuación especial
        .replace(/\s+/g, ' ') // Normalizar espacios
        .trim();

    if (!clean) {
        console.warn('No hay texto para reproducir');
        return;
    }

    // Validar que el texto tenga caracteres en inglés
    const hasEnglish = /[a-zA-Z]/.test(clean);
    if (!hasEnglish) {
        console.warn('El texto no contiene caracteres en inglés');
        return;
    }

    // Mejorar accesibilidad: actualizar aria-label
    if (btnElement) {
        btnElement.setAttribute('aria-busy', 'true');
        btnElement.setAttribute('aria-label', 'Reproduciendo audio en inglés...');
        btnElement.disabled = true;
    }

    // Cancelar cualquier reproducción previa
    window.speechSynthesis.cancel();
    
    // Pequeño delay para asegurar que se canceló
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(clean);
        
        // CONFIGURACIÓN CRÍTICA: Forzar inglés
        utterance.lang = 'en-US'; // Idioma principal
        utterance.rate = 0.9; // Velocidad clara
        utterance.pitch = 1.0; // Tono natural
        utterance.volume = 1.0; // Volumen máximo

        // Obtener y asignar la mejor voz en inglés
        const englishVoice = getEnglishVoice();
        if (englishVoice) {
            utterance.voice = englishVoice;
            console.log(`🔊 Usando voz: ${englishVoice.name} (${englishVoice.lang})`);
        } else {
            console.warn('⚠️ No se encontró voz en inglés. Usando voz por defecto.');
            // Forzar al menos el idioma aunque no haya voz específica
            utterance.lang = 'en-US';
        }

        // Manejar eventos
        if (btnElement) {
            btnElement.classList.add('is-playing');
            
            utterance.onstart = () => {
                console.log('▶️ Reproduciendo:', clean);
            };
            
            utterance.onend = () => {
                btnElement.classList.remove('is-playing');
                btnElement.setAttribute('aria-busy', 'false');
                btnElement.setAttribute('aria-label', 'Escuchar pronunciación en inglés');
                btnElement.disabled = false;
                console.log('✅ Reproducción completada');
            };
            
            utterance.onerror = (event) => {
                btnElement.classList.remove('is-playing');
                btnElement.setAttribute('aria-busy', 'false');
                btnElement.setAttribute('aria-label', 'Error al reproducir audio');
                btnElement.disabled = false;
                
                console.error('❌ Error en síntesis de voz:', event.error);
                
                // Mensajes de error específicos
                if (event.error === 'not-allowed') {
                    showNotification('Permiso denegado. Interactúa con la página primero.', 'warning');
                } else if (event.error === 'network') {
                    showNotification('Error de red al cargar el audio.', 'warning');
                } else {
                    showNotification('Error al reproducir el audio. Intenta de nuevo.', 'warning');
                }
            };
        }

        // Reproducir
        try {
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('❌ Error al iniciar síntesis de voz:', error);
            if (btnElement) {
                btnElement.classList.remove('is-playing');
                btnElement.setAttribute('aria-busy', 'false');
                btnElement.disabled = false;
            }
            showNotification('Error al iniciar el audio.', 'warning');
        }
    }, 50);
}

function speakCurrentTitle() {
    const lesson = lessonsData[currentModule]?.lessons[currentLesson];
    if (lesson) {
        // Extraer solo la parte en inglés del título (ej. "1.1: Greetings and Farewells" -> "Greetings and Farewells")
        const titleText = lesson.title.replace(/^[\d\.]+\s*:\s*/, '');
        const btn = document.getElementById('listenLessonTitleBtn');
        speakText(titleText, btn);
    }
}

function testAudioSupport() {
    if (!('speechSynthesis' in window)) {
        showNotification('Tu navegador no soporta síntesis de voz. Prueba con Chrome, Edge o Safari.', 'warning');
        return;
    }
    
    // Verificar voces disponibles
    const englishVoice = getEnglishVoice();
    
    if (englishVoice) {
        // Mostrar información de la voz que se usará
        console.log('✅ Audio configurado correctamente');
        console.log(`🔊 Voz: ${englishVoice.name}`);
        console.log(`🌍 Idioma: ${englishVoice.lang}`);
        console.log(`📍 Local: ${englishVoice.localService ? 'Sí' : 'No'}`);
        
        // Probar con una frase
        speakText("Hello! Audio is working correctly. I will always speak in English.");
        showNotification(`✅ Audio activado con voz: ${englishVoice.name}`, 'success');
    } else {
        console.warn('⚠️ No se encontraron voces en inglés');
        showNotification('⚠️ No hay voces en inglés disponibles. El audio puede no funcionar correctamente.', 'warning');
    }
}

// Sistema de notificaciones toast
function showNotification(message, type = 'info') {
    // Remover notificación anterior si existe
    const existing = document.querySelector('.toast-notification');
    if (existing) {
        existing.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// --------------------------------------------------------------------------
// CONFIGURACIÓN DE VOZ (Modal)
// --------------------------------------------------------------------------
let selectedVoiceIndex = 0;

function showVoiceSettings() {
    const modal = document.getElementById('voiceSettingsModal');
    const voiceSelect = document.getElementById('voiceSelect');
    const currentVoiceInfo = document.getElementById('currentVoiceInfo');
    
    if (!modal) return;
    
    // Cargar voces si no están cargadas
    if (cachedEnglishVoices.length === 0) {
        loadVoices().then(populateVoiceSelect);
    } else {
        populateVoiceSelect();
    }
    
    // Mostrar voz actual
    const currentVoice = getEnglishVoice();
    if (currentVoice) {
        currentVoiceInfo.textContent = `${currentVoice.name} (${currentVoice.lang})`;
    } else {
        currentVoiceInfo.textContent = 'No hay voz en inglés disponible';
    }
    
    // Mostrar modal
    modal.classList.remove('hidden');
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
}

function closeVoiceSettings() {
    const modal = document.getElementById('voiceSettingsModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function populateVoiceSelect() {
    const voiceSelect = document.getElementById('voiceSelect');
    if (!voiceSelect) return;
    
    voiceSelect.innerHTML = '';
    
    if (cachedEnglishVoices.length === 0) {
        voiceSelect.innerHTML = '<option value="">No hay voces en inglés disponibles</option>';
        return;
    }
    
    cachedEnglishVoices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})${voice.localService ? ' - Local' : ' - Online'}`;
        
        // Seleccionar la voz actual
        if (index === selectedVoiceIndex) {
            option.selected = true;
        }
        
        voiceSelect.appendChild(option);
    });
}

function updateSelectedVoice() {
    const voiceSelect = document.getElementById('voiceSelect');
    if (!voiceSelect) return;
    
    selectedVoiceIndex = parseInt(voiceSelect.value);
    
    // Actualizar caché para usar esta voz
    if (cachedEnglishVoices[selectedVoiceIndex]) {
        // Mover la voz seleccionada al principio
        const selectedVoice = cachedEnglishVoices[selectedVoiceIndex];
        cachedEnglishVoices.splice(selectedVoiceIndex, 1);
        cachedEnglishVoices.unshift(selectedVoice);
        
        // Actualizar UI
        const currentVoiceInfo = document.getElementById('currentVoiceInfo');
        if (currentVoiceInfo) {
            currentVoiceInfo.textContent = `${selectedVoice.name} (${selectedVoice.lang})`;
        }
        
        console.log('✅ Voz cambiada a:', selectedVoice.name);
    }
}

function testSelectedVoice() {
    const voice = getEnglishVoice();
    if (voice) {
        speakText("Hello! This is a test of the selected voice. I will always speak in English.");
        showNotification(`🔊 Probando voz: ${voice.name}`, 'info');
    } else {
        showNotification('No hay voz seleccionada', 'warning');
    }
}

// Cerrar modal con tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeVoiceSettings();
    }
});

// --------------------------------------------------------------------------
// 4. NAVEGACIÓN Y SIDEBAR
// --------------------------------------------------------------------------
function initModuleNav() {
    const nav = document.getElementById('moduleNav');
    if (!nav) return;
    nav.innerHTML = '';

    const query = searchQuery.trim().toLowerCase();

    lessonsData.forEach((module, moduleIndex) => {
        // Filtrar si hay búsqueda activa
        let matchingLessons = [];
        module.lessons.forEach((lesson, lessonIndex) => {
            const matches = !query || 
                lesson.title.toLowerCase().includes(query) || 
                module.title.toLowerCase().includes(query) ||
                lesson.content.toLowerCase().includes(query);
            if (matches) {
                matchingLessons.push({ lesson, lessonIndex });
            }
        });

        // Si hay búsqueda y este módulo no tiene coincidencias, omitir
        if (query && matchingLessons.length === 0) {
            return;
        }

        const isModuleOpen = query ? true : openModules.has(moduleIndex);

        const groupDiv = document.createElement('div');
        groupDiv.className = `module-group ${isModuleOpen ? 'is-open' : ''}`;
        groupDiv.id = `module-group-${moduleIndex}`;

        // Header del acordeón
        const btnHeader = document.createElement('button');
        btnHeader.className = 'module-btn-header';
        btnHeader.type = 'button';
        btnHeader.onclick = () => toggleModule(moduleIndex);

        const moduleIcons = ['📖', '✍️', '🏠', '🌍', '🎯'];
        const icon = moduleIcons[moduleIndex % moduleIcons.length];

        // Título limpio
        const cleanTitle = module.title.replace(/^[^:]+:\s*/, '');

        btnHeader.innerHTML = `
            <div class="module-header-left">
                <span class="module-badge-icon">${icon}</span>
                <span class="module-btn-title">Módulo ${moduleIndex + 1}: ${cleanTitle}</span>
            </div>
            <div class="module-header-right">
                <span class="module-fraction">${getModuleProgress(moduleIndex)}</span>
                <span class="module-chevron">▼</span>
            </div>
        `;
        
        // Añadir atributos de accesibilidad
        btnHeader.setAttribute('aria-expanded', isModuleOpen ? 'true' : 'false');
        btnHeader.setAttribute('aria-label', `Módulo ${moduleIndex + 1}: ${cleanTitle}. ${getModuleProgress(moduleIndex)} lecciones completadas.`);

        // Lista de lecciones
        const listDiv = document.createElement('div');
        listDiv.className = 'lesson-list-items';
        listDiv.id = `module-list-${moduleIndex}`;

        const lessonsToRender = query ? matchingLessons : module.lessons.map((lesson, lessonIndex) => ({ lesson, lessonIndex }));

        lessonsToRender.forEach(({ lesson, lessonIndex }) => {
            const lessonBtn = document.createElement('button');
            lessonBtn.className = 'lesson-nav-btn';
            lessonBtn.type = 'button';

            const lessonKey = `${moduleIndex}-${lessonIndex}`;
            const isCompleted = completedLessons.has(lessonKey);
            const isActive = (currentModule === moduleIndex && currentLesson === lessonIndex && !document.getElementById('lessonScreen').classList.contains('hidden'));

            if (isCompleted) lessonBtn.classList.add('is-completed');
            if (isActive) lessonBtn.classList.add('is-active');

            lessonBtn.innerHTML = `
                <span class="lesson-btn-label">${lesson.title}</span>
                <span class="lesson-status-icon">${isCompleted ? '✓' : '○'}</span>
            `;
            
            // Mejorar accesibilidad
            lessonBtn.setAttribute('aria-label', `${lesson.title}. ${isCompleted ? 'Completada' : 'No completada'}${isActive ? '. Lección actual' : ''}`);
            lessonBtn.setAttribute('aria-current', isActive ? 'page' : 'false');

            lessonBtn.onclick = () => {
                loadLesson(moduleIndex, lessonIndex);
                if (window.innerWidth <= 960) {
                    toggleMobileSidebar(false);
                }
            };

            listDiv.appendChild(lessonBtn);
        });

        groupDiv.appendChild(btnHeader);
        groupDiv.appendChild(listDiv);
        nav.appendChild(groupDiv);
    });

    if (query && nav.children.length === 0) {
        nav.innerHTML = `
            <div style="text-align: center; padding: 30px 14px; color: var(--text-muted); font-size: 0.88rem;">
                <p>🔍 No se encontraron lecciones para "<strong>${escapeHtml(query)}</strong>"</p>
            </div>
        `;
    }
}

function toggleModule(moduleIndex) {
    const isOpen = openModules.has(moduleIndex);
    
    if (isOpen) {
        openModules.delete(moduleIndex);
    } else {
        openModules.add(moduleIndex);
    }
    
    const groupDiv = document.getElementById(`module-group-${moduleIndex}`);
    if (groupDiv) {
        const newState = openModules.has(moduleIndex);
        groupDiv.classList.toggle('is-open', newState);
        
        // Mejorar accesibilidad con aria-expanded
        const btnHeader = groupDiv.querySelector('.module-btn-header');
        if (btnHeader) {
            btnHeader.setAttribute('aria-expanded', newState);
        }
    }
}

function toggleMobileSidebar(force) {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (!sidebar || !backdrop) return;

    const shouldOpen = force !== undefined ? force : !sidebar.classList.contains('is-open');
    sidebar.classList.toggle('is-open', shouldOpen);
    backdrop.classList.toggle('is-open', shouldOpen);
}

// --------------------------------------------------------------------------
// 5. BÚSQUEDA Y FILTRADO
// --------------------------------------------------------------------------
function handleSearchLessons(query) {
    searchQuery = query;
    const clearBtn = document.getElementById('clearSearchBtn');
    if (clearBtn) {
        clearBtn.classList.toggle('hidden', !query);
    }
    initModuleNav();
}

function clearSearch() {
    const input = document.getElementById('lessonSearchInput');
    if (input) {
        input.value = '';
        handleSearchLessons('');
    }
}

// --------------------------------------------------------------------------
// 6. CARGA Y NAVEGACIÓN DE LECCIONES
// --------------------------------------------------------------------------
function loadLesson(moduleIndex, lessonIndex) {
    currentModule = moduleIndex;
    currentLesson = lessonIndex;

    openModules.add(moduleIndex);

    const lesson = lessonsData[moduleIndex]?.lessons[lessonIndex];
    if (!lesson) return;

    // Alternar vistas
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('lessonScreen').classList.remove('hidden');

    // Breadcrumbs y títulos
    const moduleTag = document.getElementById('lessonModuleTag');
    const indexTag = document.getElementById('lessonIndexTag');
    if (moduleTag) moduleTag.textContent = `Módulo ${moduleIndex + 1}`;
    if (indexTag) indexTag.textContent = `Lección ${lessonIndex + 1}`;

    const lessonTitleEl = document.getElementById('lessonTitle');
    if (lessonTitleEl) lessonTitleEl.textContent = lesson.title;

    // Renderizar contenido parseado
    const lessonBody = document.getElementById('lessonBody');
    if (lessonBody) {
        lessonBody.innerHTML = parseMarkdown(lesson.content);
    }

    // Actualizar botones y estado
    updateLessonStatusButton();
    updateFooterNavigation();
    initModuleNav();

    // Desplazar vista arriba
    const mainViewport = document.getElementById('mainViewport');
    if (mainViewport) {
        mainViewport.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateLessonStatusButton() {
    const lessonKey = `${currentModule}-${currentLesson}`;
    const isCompleted = completedLessons.has(lessonKey);

    const btn = document.getElementById('markDoneBtn');
    const text = document.getElementById('markDoneText');
    const icon = document.getElementById('markDoneIcon');
    const badge = document.getElementById('lessonStatusBadge');

    if (btn) {
        btn.classList.toggle('is-completed', isCompleted);
    }
    if (text) {
        text.textContent = isCompleted ? 'Lección completada' : 'Marcar como completada';
    }
    if (icon) {
        icon.textContent = isCompleted ? '✓' : '○';
    }
    if (badge) {
        badge.textContent = isCompleted ? 'Completada ✓' : 'En progreso';
        badge.classList.toggle('is-done', isCompleted);
    }
}

function toggleCurrentLessonCompleted() {
    const lessonKey = `${currentModule}-${currentLesson}`;
    const wasCompleted = completedLessons.has(lessonKey);
    
    if (wasCompleted) {
        completedLessons.delete(lessonKey);
        showNotification('Lección marcada como no completada', 'info');
    } else {
        completedLessons.add(lessonKey);
        triggerConfetti(30);
        showNotification('¡Excelente! Lección completada 🎉', 'success');
    }
    
    saveProgress();
    updateLessonStatusButton();
    initModuleNav();
}

function updateFooterNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Botón Anterior
    if (currentModule === 0 && currentLesson === 0) {
        if (prevBtn) prevBtn.style.visibility = 'hidden';
    } else {
        if (prevBtn) prevBtn.style.visibility = 'visible';
    }

    // Botón Siguiente
    const lastModule = lessonsData.length - 1;
    const lastLesson = lessonsData[lastModule].lessons.length - 1;

    if (nextBtn) {
        if (currentModule === lastModule && currentLesson === lastLesson) {
            nextBtn.innerHTML = '<span>Finalizar Curso 🎉</span>';
        } else {
            nextBtn.innerHTML = '<span>Siguiente Lección →</span>';
        }
    }
}

function previousLesson() {
    if (currentLesson > 0) {
        loadLesson(currentModule, currentLesson - 1);
    } else if (currentModule > 0) {
        const prevMod = currentModule - 1;
        const lastLessonIndex = lessonsData[prevMod].lessons.length - 1;
        loadLesson(prevMod, lastLessonIndex);
    }
}

function nextLesson() {
    // Marcar lección actual como completada al avanzar
    const currentKey = `${currentModule}-${currentLesson}`;
    if (!completedLessons.has(currentKey)) {
        completedLessons.add(currentKey);
        saveProgress();
    }

    const lastLesson = lessonsData[currentModule].lessons.length - 1;

    if (currentLesson < lastLesson) {
        loadLesson(currentModule, currentLesson + 1);
    } else if (currentModule < lessonsData.length - 1) {
        loadLesson(currentModule + 1, 0);
    } else {
        showCompletionMessage();
    }
}

function startCourse() {
    loadLesson(0, 0);
}

function startModule(moduleIndex) {
    loadLesson(moduleIndex, 0);
}

function goBack() {
    document.getElementById('welcomeScreen').classList.remove('hidden');
    document.getElementById('lessonScreen').classList.add('hidden');
    initModuleNav();
}

function showCompletionMessage() {
    const lessonBody = document.getElementById('lessonBody');
    triggerConfetti(120);

    lessonBody.innerHTML = `
        <div class="completion-banner">
            <h2>🏆 ¡Felicitaciones!</h2>
            <p>
                Has completado con éxito todas las lecciones del <strong>Curso Interactivo de Inglés A1</strong>.
            </p>
            <div style="font-size: 3.5rem; margin: 20px 0;">🎉 ✨ 🌟</div>
            <p style="font-size: 0.95rem; color: var(--text-muted);">
                Progreso: ${completedLessons.size} de ${getTotalLessonsCount()} lecciones terminadas.
            </p>
            <div style="display: flex; justify-content: center; gap: 14px; margin-top: 32px; flex-wrap: wrap;">
                <button class="btn-primary" onclick="startCourse()">
                    Repasar Curso
                </button>
                <button class="btn-secondary" onclick="goBack()">
                    Volver al Inicio
                </button>
            </div>
        </div>
    `;

    document.getElementById('lessonTitle').textContent = "¡Curso Completado!";
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.style.visibility = 'hidden';
    if (nextBtn) nextBtn.style.visibility = 'hidden';
}

function resetCourse() {
    if (confirm('¿Estás seguro de que deseas reiniciar todo el progreso del curso? Esta acción no se puede deshacer.')) {
        completedLessons.clear();
        saveProgress();
        goBack();
    }
}

// --------------------------------------------------------------------------
// 7. PARSER DE MARKDOWN ROBUSTO & ENRIQUECIDO
// --------------------------------------------------------------------------
function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function parseMarkdown(markdown) {
    if (!markdown) return '';

    let text = markdown;

    // Eliminar el primer título H1 repetido si coincide con el título
    text = text.replace(/^#\s+Lesson\s+[\d\.]+:?[^\n]*\n+/i, '');

    // 1. PRE-PROCESAR EJERCICIOS (Bloques ### Exercise ...)
    text = text.replace(/###\s+(Exercise[^\n]*)([\s\S]*?)(?=(?:###|##|$))/gi, (match, exTitle, exBody) => {
        return `\n\n:::EXERCISE_START:::${exTitle}\n${exBody}:::EXERCISE_END:::\n\n`;
    });

    // 2. TABLAS (antes que otros reemplazos de línea)
    const tableRegex = /\|(.+)\|\n\|[\s:|-]+\|\n((?:\|.+\|\n?)+)/g;
    text = text.replace(tableRegex, (match, headerLine, bodyLines) => {
        const headers = headerLine.split('|').filter(c => c.trim() !== '');
        const rows = bodyLines.trim().split('\n');

        // Detectar si es tabla de traducción (buscar "Traducción" o "Translation" en el header)
        const isTranslationTable = headerLine.toLowerCase().includes('traducción') || 
                                   headerLine.toLowerCase().includes('translation') ||
                                   headerLine.toLowerCase().includes('español');

        let tableHtml = '<div class="table-responsive-wrapper"><table';
        
        // Agregar clase especial si es tabla de traducción
        if (isTranslationTable) {
            tableHtml += ' class="translation-table"';
        }
        
        tableHtml += '><thead><tr>';
        
        headers.forEach(h => {
            tableHtml += `<th>${h.trim()}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';

        rows.forEach(row => {
            const cells = row.split('|').filter(c => c.trim() !== '');
            if (cells.length > 0) {
                tableHtml += '<tr>';
                cells.forEach((cell, idx) => {
                    let cellContent = cell.trim();
                    // Solo agregar botón de audio si NO es tabla de traducción
                    let audioBtn = '';
                    if (!isTranslationTable) {
                        const matchBold = cellContent.match(/\*\*([^*]+)\*\*/);
                        if (matchBold && idx === 0) {
                            const wordToSpeak = escapeHtml(matchBold[1]);
                            audioBtn = ` <button class="btn-speech-play" onclick="speakText('${wordToSpeak}', this)" title="Escuchar">🔊</button>`;
                        }
                    }
                    tableHtml += `<td>${cellContent}${audioBtn}</td>`;
                });
                tableHtml += '</tr>';
            }
        });

        tableHtml += '</tbody></table></div>';
        return tableHtml;
    });

    // 3. HEADERS (H2 y H3)
    text = text.replace(/^##\s+(.*$)/gim, '<h2>$1</h2>');
    text = text.replace(/^###\s+(.*$)/gim, '<h3>$1</h3>');

    // 4. NEGRITA & CURSIVA
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/(?<!\*)\*([^\*\n]+?)\*(?!\*)/g, '<em>$1</em>');

    // 5. DIÁLOGOS Y CONVERSACIONES (Speaker A / B / Teacher / etc)
    // Identificar patrones de diálogo como * **A**: ... o * **Teacher**: ...
    text = text.replace(/^\*\s+<strong>([A-Za-z0-9\s]+)<\/strong>:\s+(.+)$/gim, (match, speaker, phrase) => {
        const cleanPhrase = phrase.replace(/<[^>]+>/g, '').replace(/[\(\[].*?[\)\]]/g, '').trim();
        const safeSpeaker = escapeHtml(speaker);
        const safeSpeakText = cleanPhrase.replace(/'/g, "\\'");
        return `<div class="dialogue-line"><span class="dialogue-speaker">${safeSpeaker}:</span><span class="dialogue-text">${phrase}</span><button class="btn-speech-play" onclick="speakText('${safeSpeakText}', this)" title="Escuchar frase">🔊</button></div>`;
    });

    // 6. LISTAS CON VIÑETAS (* o - con 1 o más espacios)
    text = text.replace(/^[\*-]\s+(.+)$/gim, (match, itemContent) => {
        // Agregar botón de pronunciación a elementos con palabras destacadas en inglés
        let audioBtn = '';
        const matchBold = itemContent.match(/<strong>([A-Za-z\s'\?,!\-]+)<\/strong>/);
        if (matchBold && !itemContent.includes('btn-speech-play')) {
            const word = matchBold[1].replace(/<[^>]+>/g, '').trim();
            if (word && word.length < 50) {
                const safeWord = word.replace(/'/g, "\\'");
                audioBtn = `<button class="btn-speech-play" onclick="speakText('${safeWord}', this)" title="Escuchar pronunciación">🔊</button>`;
            }
        }
        return `<li><span class="li-content">${itemContent}</span>${audioBtn}</li>`;
    });

    // Agrupar <li> consecutivos en <ul>
    text = text.replace(/(?:<li>.*?<\/li>\n?)+/gs, (match) => {
        return `<ul>${match}</ul>`;
    });

    // 7. LISTAS NUMERADAS
    text = text.replace(/^\d+\.\s+(.+)$/gim, '<div class="exercise-item">$1</div>');

    // 8. FINALIZAR CONTENEDORES DE EJERCICIOS (:::EXERCISE_START::: ... :::EXERCISE_END:::)
    text = text.replace(/:::EXERCISE_START:::(.*?)\n([\s\S]*?):::EXERCISE_END:::/gs, (match, exTitle, exBody) => {
        return `
            <div class="exercise-box">
                <div class="exercise-header">
                    <h3>✏️ ${exTitle.trim()}</h3>
                </div>
                <div class="exercise-content">
                    ${exBody.trim()}
                </div>
            </div>
        `;
    });

    // 9. PÁRRAFOS REGULARES
    const blocks = text.split(/\n\n+/);
    text = blocks.map(block => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('<h2') || 
            trimmed.startsWith('<h3') || 
            trimmed.startsWith('<ul') || 
            trimmed.startsWith('<ol') || 
            trimmed.startsWith('<div') || 
            trimmed.startsWith('<table')) {
            return trimmed;
        }
        return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    }).join('\n\n');

    return text;
}

// --------------------------------------------------------------------------
// 8. EFECTO CONFETTI (Celebración en Canvas)
// --------------------------------------------------------------------------
function triggerConfetti(particleCount = 50) {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 16,
            vy: (Math.random() - 0.7) * 18,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10,
            opacity: 1
        });
    }

    let animationFrame;
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = 0;

        particles.forEach(p => {
            if (p.opacity > 0.01) {
                active++;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.4; // Gravedad
                p.vx *= 0.98; // Fricción
                p.rotation += p.rotSpeed;
                p.opacity -= 0.012;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
        });

        if (active > 0) {
            animationFrame = requestAnimationFrame(render);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(animationFrame);
        }
    }

    render();
}

// --------------------------------------------------------------------------
// 9. INICIALIZACIÓN
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadProgress();
    initModuleNav();
    updateProgressBar();
    updateTotalLessonsBadge();

    // Redimensionar canvas de confetti
    window.addEventListener('resize', () => {
        const canvas = document.getElementById('confettiCanvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });
});


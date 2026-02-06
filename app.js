// Estado de la aplicación
let currentModule = 0;
let currentLesson = 0;
let completedLessons = new Set();

// Cargar progreso guardado
function loadProgress() {
    const saved = localStorage.getItem('courseProgress');
    if (saved) {
        completedLessons = new Set(JSON.parse(saved));
    }
}

// Guardar progreso
function saveProgress() {
    localStorage.setItem('courseProgress', JSON.stringify([...completedLessons]));
    updateProgressBar();
}

// Actualizar barra de progreso
function updateProgressBar() {
    const totalLessons = lessonsData.reduce((sum, module) => sum + module.lessons.length, 0);
    const completed = completedLessons.size;
    const percentage = Math.round((completed / totalLessons) * 100);
    
    document.getElementById('progressBar').style.width = percentage + '%';
    document.getElementById('progressText').textContent = percentage + '%';
}

// Inicializar navegación de módulos
function initModuleNav() {
    const nav = document.getElementById('moduleNav');
    nav.innerHTML = '';
    
    lessonsData.forEach((module, moduleIndex) => {
        const moduleDiv = document.createElement('div');
        moduleDiv.className = 'module';
        
        const moduleTitle = document.createElement('div');
        moduleTitle.className = 'module-title';
        moduleTitle.innerHTML = `
            <span>${module.title}</span>
            <span>${getModuleProgress(moduleIndex)}</span>
        `;
        moduleTitle.onclick = () => toggleModule(moduleIndex);
        
        const lessonList = document.createElement('div');
        lessonList.className = 'lesson-list';
        lessonList.id = `module-${moduleIndex}`;
        
        module.lessons.forEach((lesson, lessonIndex) => {
            const lessonItem = document.createElement('div');
            lessonItem.className = 'lesson-item';
            const lessonKey = `${moduleIndex}-${lessonIndex}`;
            
            if (completedLessons.has(lessonKey)) {
                lessonItem.classList.add('completed');
            }
            
            lessonItem.textContent = lesson.title;
            lessonItem.onclick = () => loadLesson(moduleIndex, lessonIndex);
            lessonList.appendChild(lessonItem);
        });
        
        moduleDiv.appendChild(moduleTitle);
        moduleDiv.appendChild(lessonList);
        nav.appendChild(moduleDiv);
    });
}

// Obtener progreso del módulo
function getModuleProgress(moduleIndex) {
    const module = lessonsData[moduleIndex];
    let completed = 0;
    module.lessons.forEach((_, lessonIndex) => {
        if (completedLessons.has(`${moduleIndex}-${lessonIndex}`)) {
            completed++;
        }
    });
    return `${completed}/${module.lessons.length}`;
}

// Toggle módulo
function toggleModule(moduleIndex) {
    const lessonList = document.getElementById(`module-${moduleIndex}`);
    lessonList.style.display = lessonList.style.display === 'none' ? 'block' : 'none';
}

// Cargar lección
function loadLesson(moduleIndex, lessonIndex) {
    currentModule = moduleIndex;
    currentLesson = lessonIndex;
    
    const lesson = lessonsData[moduleIndex].lessons[lessonIndex];
    
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('lessonScreen').classList.remove('hidden');
    
    document.getElementById('lessonTitle').textContent = lesson.title;
    document.getElementById('lessonBody').innerHTML = parseMarkdown(lesson.content);
    
    // Actualizar navegación
    updateLessonNav();
    updateActiveLesson();
    
    // Marcar como completada
    const lessonKey = `${moduleIndex}-${lessonIndex}`;
    completedLessons.add(lessonKey);
    saveProgress();
    initModuleNav();
    
    // Scroll al inicio
    document.querySelector('.lesson-content').scrollTop = 0;
}

// Actualizar navegación de lecciones
function updateLessonNav() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Botón anterior
    if (currentModule === 0 && currentLesson === 0) {
        prevBtn.style.visibility = 'hidden';
    } else {
        prevBtn.style.visibility = 'visible';
    }
    
    // Botón siguiente
    const lastModule = lessonsData.length - 1;
    const lastLesson = lessonsData[lastModule].lessons.length - 1;
    if (currentModule === lastModule && currentLesson === lastLesson) {
        nextBtn.textContent = 'Finalizar Curso ✓';
    } else {
        nextBtn.textContent = 'Siguiente →';
    }
}

// Actualizar lección activa en sidebar
function updateActiveLesson() {
    document.querySelectorAll('.lesson-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const moduleDiv = document.getElementById(`module-${currentModule}`);
    if (moduleDiv) {
        moduleDiv.style.display = 'block';
        const lessonItems = moduleDiv.querySelectorAll('.lesson-item');
        if (lessonItems[currentLesson]) {
            lessonItems[currentLesson].classList.add('active');
        }
    }
}

// Lección anterior
function previousLesson() {
    if (currentLesson > 0) {
        loadLesson(currentModule, currentLesson - 1);
    } else if (currentModule > 0) {
        const prevModule = currentModule - 1;
        const lastLesson = lessonsData[prevModule].lessons.length - 1;
        loadLesson(prevModule, lastLesson);
    }
}

// Siguiente lección
function nextLesson() {
    const lastLesson = lessonsData[currentModule].lessons.length - 1;
    
    if (currentLesson < lastLesson) {
        loadLesson(currentModule, currentLesson + 1);
    } else if (currentModule < lessonsData.length - 1) {
        loadLesson(currentModule + 1, 0);
    } else {
        showCompletionMessage();
    }
}

// Mensaje de finalización
function showCompletionMessage() {
    const lessonBody = document.getElementById('lessonBody');
    lessonBody.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
            <h2 style="font-size: 3em; color: #4CAF50; margin-bottom: 20px;">🎉 ¡Felicitaciones!</h2>
            <p style="font-size: 1.5em; color: #666; margin-bottom: 30px;">
                Has completado todo el curso de inglés
            </p>
            <p style="font-size: 1.2em; color: #888;">
                Has terminado las ${completedLessons.size} lecciones del curso.
            </p>
            <button class="btn-primary" onclick="resetCourse()" style="margin-top: 30px;">
                Reiniciar Curso
            </button>
        </div>
    `;
}

// Volver al inicio
function goBack() {
    document.getElementById('welcomeScreen').classList.remove('hidden');
    document.getElementById('lessonScreen').classList.add('hidden');
}

// Comenzar curso
function startCourse() {
    loadLesson(0, 0);
}

// Reiniciar curso
function resetCourse() {
    if (confirm('¿Estás seguro de que quieres reiniciar el curso? Se perderá todo tu progreso.')) {
        completedLessons.clear();
        saveProgress();
        initModuleNav();
        goBack();
    }
}

// Parser simple de Markdown a HTML
function parseMarkdown(markdown) {
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h2>$1</h2>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic (pero no afectar los asteriscos de listas)
    html = html.replace(/(?<!\*)\*([^\*\n]+?)\*(?!\*)/g, '<em>$1</em>');
    
    // Tablas (procesar antes que otros elementos)
    const tableRegex = /\|(.+)\|\n\|[\s:|-]+\|\n((?:\|.+\|\n?)+)/g;
    html = html.replace(tableRegex, (match) => {
        const lines = match.trim().split('\n');
        let tableHtml = '<table>';
        
        lines.forEach((line, index) => {
            if (index === 1) return; // Skip separator line
            const cells = line.split('|').filter(cell => cell.trim());
            const tag = index === 0 ? 'th' : 'td';
            tableHtml += '<tr>' + cells.map(cell => `<${tag}>${cell.trim()}</${tag}>`).join('') + '</tr>';
        });
        
        tableHtml += '</table>';
        return tableHtml;
    });
    
    // Listas con viñetas (*   o -)
    html = html.replace(/^[\*-]   (.+)$/gim, '<li>$1</li>');
    
    // Agrupar listas consecutivas
    html = html.replace(/(<li>.*?<\/li>\n?)+/gs, (match) => {
        return '<ul>' + match + '</ul>';
    });
    
    // Listas numeradas (1. 2. 3. etc)
    html = html.replace(/^\d+\.\s+(.+)$/gim, '<li>$1</li>');
    
    // Agrupar listas numeradas consecutivas
    html = html.replace(/(<li>.*?<\/li>\n?)+/gs, (match) => {
        // Si ya está envuelto en ul, no hacer nada
        if (match.includes('<ul>')) return match;
        return '<ol>' + match + '</ol>';
    });
    
    // Ejercicios (envolver en div especial)
    html = html.replace(/(### Exercise.*?)(?=###|<h2>|$)/gs, '<div class="exercise">$1</div>');
    
    // Párrafos (evitar envolver elementos ya procesados)
    html = html.split('\n\n').map(para => {
        para = para.trim();
        if (!para) return '';
        if (para.match(/^<(h\d|ul|ol|table|div|li)/)) {
            return para;
        }
        return '<p>' + para + '</p>';
    }).join('\n');
    
    return html;
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    initModuleNav();
    updateProgressBar();
});

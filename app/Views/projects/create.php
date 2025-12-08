<?= $this->extend('layout') ?>
<?= $this->section('content') ?>

<div class="form-container">
    <div class="form-header">
        <a href="<?= base_url('projects') ?>" class="back-link">
            <i class="fas fa-arrow-left"></i>
            Back to Projects
        </a>
        <h1>Create New Project</h1>
        <p class="form-subtitle">Fill in the details below to create a new project</p>
    </div>

    <?php if (isset($error)): ?>
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <?= $error ?>
        </div>
    <?php endif; ?>

    <form action="<?= base_url('projects/store') ?>" method="post" enctype="multipart/form-data" class="project-form">
        <div class="form-grid">
            <div class="form-group">
                <label for="name">
                    <i class="fas fa-tag"></i>
                    Project Name
                </label>
                <input type="text" 
                       name="name" 
                       id="name" 
                       placeholder="Enter project name"
                       required>
                <?php if (isset($validation) && $validation->getError('name')): ?>
                    <div class="field-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <?= $validation->getError('name') ?>
                    </div>
                <?php endif; ?>
            </div>

            <div class="form-group full-width">
                <label for="description">
                    <i class="fas fa-align-left"></i>
                    Description
                </label>
                <textarea id="description" 
                          name="description" 
                          rows="6"
                          placeholder="Describe the project goals, objectives, and key deliverables..."
                          required></textarea>
                <?php if (isset($validation) && $validation->getError('description')): ?>
                    <div class="field-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <?= $validation->getError('description') ?>
                    </div>
                <?php endif; ?>
            </div>

            <div class="form-group">
                <label for="datebegin">
                    <i class="fas fa-calendar-alt"></i>
                    Start Date
                </label>
                <input type="date" 
                       name="datebegin" 
                       id="datebegin"
                       required>
                <?php if (isset($validation) && $validation->getError('datebegin')): ?>
                    <div class="field-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <?= $validation->getError('datebegin') ?>
                    </div>
                <?php endif; ?>
            </div>

            <div class="form-group">
                <label for="dateend">
                    <i class="fas fa-calendar-check"></i>
                    End Date
                </label>
                <input type="date" 
                       name="dateend" 
                       id="dateend"
                       required>
                <?php if (isset($validation) && $validation->getError('dateend')): ?>
                    <div class="field-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <?= $validation->getError('dateend') ?>
                    </div>
                <?php endif; ?>
            </div>

            <div class="form-group">
                <label for="nbrperson">
                    <i class="fas fa-users"></i>
                    Number of Personnel
                </label>
                <input type="number" 
                       name="nbrperson" 
                       id="nbrperson" 
                       min="1"
                       placeholder="e.g., 5"
                       required>
                <?php if (isset($validation) && $validation->getError('nbrperson')): ?>
                    <div class="field-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <?= $validation->getError('nbrperson') ?>
                    </div>
                <?php endif; ?>
            </div>

            <div class="form-group">
                <label for="file">
                    <i class="fas fa-paperclip"></i>
                    Project Files
                </label>
                <div class="file-input-wrapper">
                    <input type="file" 
                           id="file" 
                           name="file" 
                           accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                           class="file-input">
                    <div class="file-input-label">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <span>Choose files or drag and drop</span>
                        <small>PDF, DOC, XLS, PNG, JPG (Max 10MB)</small>
                    </div>
                </div>
                <?php if (isset($validation) && $validation->getError('file')): ?>
                    <div class="field-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <?= $validation->getError('file') ?>
                    </div>
                <?php endif; ?>
            </div>

            <div class="form-group full-width">
                <label for="remark">
                    <i class="fas fa-sticky-note"></i>
                    Additional Remarks
                </label>
                <textarea id="remark" 
                          name="remark" 
                          rows="4"
                          placeholder="Any additional notes or special requirements..."></textarea>
                <?php if (isset($validation) && $validation->getError('remark')): ?>
                    <div class="field-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <?= $validation->getError('remark') ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>

        <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="history.back()">
                <i class="fas fa-times"></i>
                Cancel
            </button>
            <button type="submit" class="btn btn-primary">
                <i class="fas fa-save"></i>
                Create Project
            </button>
        </div>
    </form>
</div>

<style>
    .form-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 40px;
    }

    .form-header {
        margin-bottom: 40px;
        text-align: center;
    }

    .back-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--text-secondary);
        text-decoration: none;
        font-weight: 500;
        margin-bottom: 24px;
        transition: all 0.3s ease;
    }

    .back-link:hover {
        color: var(--accent-primary);
        transform: translateX(-4px);
    }

    .form-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 12px;
        background: linear-gradient(135deg, var(--text-primary), var(--text-secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .form-subtitle {
        color: var(--text-secondary);
        font-size: 1.125rem;
        font-weight: 500;
    }

    .project-form {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 24px;
        padding: 40px;
        box-shadow: var(--shadow-lg);
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 32px;
        margin-bottom: 40px;
    }

    .form-group {
        position: relative;
    }

    .form-group.full-width {
        grid-column: 1 / -1;
    }

    .form-group label {
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--text-primary);
        font-size: 0.9375rem;
        transition: color 0.3s ease;
    }

    .form-group label i {
        color: var(--accent-primary);
        font-size: 16px;
    }

    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 16px 20px;
        background: var(--bg-secondary);
        border: 2px solid var(--border-color);
        border-radius: 16px;
        color: var(--text-primary);
        font-size: 1rem;
        font-weight: 500;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: inherit;
    }

    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--accent-primary);
        background: var(--bg-tertiary);
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        transform: translateY(-2px);
    }

    .form-group input:focus + .file-input-label,
    .form-group textarea:focus {
        border-color: var(--accent-primary);
    }

    .form-group input::placeholder,
    .form-group textarea::placeholder {
        color: var(--text-muted);
    }

    .form-group textarea {
        resize: vertical;
        min-height: 120px;
    }

    .file-input-wrapper {
        position: relative;
        overflow: hidden;
    }

    .file-input {
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .file-input-label {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 40px 20px;
        background: var(--bg-secondary);
        border: 2px dashed var(--border-color);
        border-radius: 16px;
        color: var(--text-secondary);
        text-align: center;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .file-input-label i {
        font-size: 48px;
        color: var(--accent-primary);
    }

    .file-input-label span {
        font-weight: 600;
        font-size: 1rem;
    }

    .file-input-label small {
        color: var(--text-muted);
        font-size: 0.875rem;
    }

    .file-input-wrapper:hover .file-input-label {
        background: var(--bg-tertiary);
        border-color: var(--accent-primary);
        color: var(--text-primary);
    }

    .file-input-wrapper.has-file .file-input-label {
        background: rgba(99, 102, 241, 0.1);
        border-color: var(--accent-primary);
        color: var(--accent-primary);
    }

    .field-error {
        color: var(--accent-danger);
        font-size: 0.875rem;
        margin-top: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
        0% {
            opacity: 0;
            transform: translateY(-10px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .error-message {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
        color: var(--accent-danger);
        padding: 20px 24px;
        border-radius: 16px;
        margin-bottom: 32px;
        font-weight: 500;
        border: 1px solid rgba(239, 68, 68, 0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideDown 0.4s ease-out;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        padding-top: 32px;
        border-top: 1px solid var(--border-color);
    }

    .btn {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 16px 32px;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        border-radius: 16px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        text-decoration: none;
        box-shadow: var(--shadow-md);
        position: relative;
        overflow: hidden;
    }

    .btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
    }

    .btn:hover::before {
        left: 100%;
    }

    .btn-primary {
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        color: white;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-xl);
    }

    .btn-secondary {
        background: var(--bg-tertiary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
    }

    .btn-secondary:hover {
        background: var(--bg-hover);
        transform: translateY(-2px);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .form-container {
            padding: 20px;
        }

        .form-header h1 {
            font-size: 2rem;
        }

        .project-form {
            padding: 24px;
        }

        .form-grid {
            grid-template-columns: 1fr;
            gap: 24px;
        }

        .form-actions {
            flex-direction: column;
        }

        .btn {
            width: 100%;
            justify-content: center;
        }
    }

    @media (max-width: 480px) {
        .form-container {
            padding: 16px;
        }

        .project-form {
            padding: 20px;
        }

        .form-header h1 {
            font-size: 1.75rem;
        }

        .form-group input,
        .form-group textarea {
            padding: 14px 16px;
        }

        .file-input-label {
            padding: 32px 16px;
        }

        .file-input-label i {
            font-size: 36px;
        }
    }
</style>

<script>
    // File input handling
    const fileInput = document.getElementById('file');
    const fileInputWrapper = fileInput.parentElement;
    const fileInputLabel = fileInputWrapper.querySelector('.file-input-label');

    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const fileName = this.files[0].name;
            const fileSize = (this.files[0].size / 1024 / 1024).toFixed(2);
            
            fileInputLabel.innerHTML = `
                <i class="fas fa-file"></i>
                <span>${fileName}</span>
                <small>File size: ${fileSize} MB</small>
            `;
            fileInputWrapper.classList.add('has-file');
        } else {
            fileInputLabel.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <span>Choose files or drag and drop</span>
                <small>PDF, DOC, XLS, PNG, JPG (Max 10MB)</small>
            `;
            fileInputWrapper.classList.remove('has-file');
        }
    });

    // Date validation
    const dateBegin = document.getElementById('datebegin');
    const dateEnd = document.getElementById('dateend');

    dateBegin.addEventListener('change', function() {
        dateEnd.min = this.value;
        if (dateEnd.value && dateEnd.value < this.value) {
            dateEnd.value = this.value;
        }
    });

    // Form submission loading state
    document.querySelector('.project-form').addEventListener('submit', function() {
        const submitBtn = this.querySelector('.btn-primary');
        const originalContent = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Project...';
        
        // Reset after 3 seconds (for demo)
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
        }, 3000);
    });

    // Add ripple effects to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
</script>

<?= $this->endSection() ?>

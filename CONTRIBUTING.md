# Contributing to SMC Citizen Complaint Portal

Thank you for your interest in contributing to the Solapur Municipal Corporation Citizen Complaint Portal!

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Git

### Setup Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/smc-complaint-portal.git
   cd smc-complaint-portal
   ```

2. **Backend Setup**
   ```bash
   cd Citizen-backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Frontend Setup**
   ```bash
   cd citizen-frontend-react
   npm install
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB
   # Then seed the database
   cd Citizen-backend
   node scripts/seedDepartments.js
   node scripts/createAdmin.js
   ```

5. **Run Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd Citizen-backend
   npm start

   # Terminal 2 - Frontend
   cd citizen-frontend-react
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style
- Use meaningful variable and function names
- Follow existing code structure and patterns
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages
Follow conventional commits format:
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

Examples:
```
feat: add complaint filtering by department
fix: resolve login authentication issue
docs: update API documentation
```

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation
- `refactor/code-improvement` - Refactoring

## 🔄 Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, readable code
   - Test your changes thoroughly
   - Update documentation if needed

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

4. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Go to GitHub repository
   - Click "New Pull Request"
   - Describe your changes clearly
   - Link any related issues

### Pull Request Checklist
- [ ] Code follows project style guidelines
- [ ] Changes have been tested locally
- [ ] Documentation updated (if needed)
- [ ] No console errors or warnings
- [ ] Commit messages are clear and descriptive

## 🧪 Testing

### Manual Testing
1. Test all affected features
2. Check both frontend and backend
3. Verify on different screen sizes
4. Test error scenarios

### Before Submitting
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] All features work as expected
- [ ] No console errors in browser
- [ ] API endpoints respond correctly

## 📚 Project Structure

```
smc-complaint-portal/
├── Citizen-backend/          # Backend API
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/          # Middleware functions
│   ├── services/            # Business logic
│   └── scripts/             # Utility scripts
│
├── citizen-frontend-react/   # Frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context
│   │   └── services/        # API services
│   └── public/              # Static assets
│
└── docs/                     # Documentation
```

## 🎯 Areas for Contribution

### High Priority
- Bug fixes
- Performance improvements
- Security enhancements
- Documentation improvements

### Feature Requests
- Email notifications
- SMS alerts
- Advanced analytics
- Report generation
- Mobile responsiveness improvements

### Documentation
- API documentation
- User guides
- Deployment guides
- Troubleshooting guides

## 🐛 Reporting Bugs

### Before Reporting
1. Check if bug already reported
2. Try to reproduce the bug
3. Gather relevant information

### Bug Report Should Include
- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node version)

### Create Issue
Go to GitHub Issues and create a new issue with the bug template.

## 💡 Suggesting Features

### Feature Request Should Include
- Clear description of the feature
- Use case / problem it solves
- Proposed solution
- Alternative solutions considered
- Additional context

## 📞 Getting Help

- Check [Documentation](docs/README.md)
- Review [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
- Check existing GitHub Issues
- Create a new issue for questions

## 🤝 Code of Conduct

### Our Standards
- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## 🙏 Thank You!

Your contributions help make this project better for everyone. We appreciate your time and effort!

---

**Questions?** Feel free to create an issue or reach out to the maintainers.

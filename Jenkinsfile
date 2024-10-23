pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git url: 'https://github.com/matej2314/Notes-Web-Application.git', credentialsId: 'github-token-id'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t notesapp:latest -f Dockerfile .'
            }
        }
    }
}


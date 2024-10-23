pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                script {
                    // Pobranie URL repozytorium z parametru przekazanego przez webhook
                    git url: "${GITHUB_REPO_URL}", credentialsId: 'webhook-token'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Budowanie obrazu Docker z pliku Dockerfile
                    sh 'docker build -t notesapp:latest -f Dockerfile .'
                }
            }
        }
    }
}
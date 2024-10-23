pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                // Klonowanie repozytorium
                git url: 'https://github.com/matej2314/Notes-Web-Application.git', credentialsId: 'twój_credential_id'
            }
        }
        
         stage('Build Docker Image') {
            steps {
                script {
                    // Budowanie obrazu Docker z pliku Dockerfile w repozytorium
                    sh 'docker build -t notesapp:latest -f Dockerfile .'
                }
            }
        }
}
}
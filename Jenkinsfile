pipeline {
    agent any 

    stages {
        stage('Clone') {
            steps {
                script {
                    echo "Cloning repository from ${GITHUB_REPO_URL}"
                    git url: "${GITHUB_REPO_URL}", branch: 'main'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker --version'
                    sh "docker build -t ${CONT_NAME}:latest -f Dockerfile ."
                }
            }
        }
    }
}


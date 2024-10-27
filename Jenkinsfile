pipeline {
    agent any 

    stages {
        stage('Clone') {
            steps {
                script {
                    checkout([$class: 'GitSCM', branches: [[name: 'main']], userRemoteConfigs: [[url: "${GITHUB_REPO_URL}"]]])
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


pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                script {
                    echo "Cloning repository from ${GITHUB_REPO_URL}"
                    git url: "${GITHUB_REPO_URL}"
                }
            }
        }
        
        stage('Build Docker Image') {
            agent {
                docker {
                    image 'docker:latest' // Użyj odpowiedniego obrazu Dockera
                    args '-v /var/run/docker.sock:/var/run/docker.sock' // Dodaj dostęp do Docker Socket
                }
            }
            steps {
                script {
                    echo "Building Docker image..."
                    sh 'docker build -t ${CONT_NAME}:latest -f Dockerfile .'
                    echo "Docker image build completed."
                }
            }
        }
    }
}

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
            steps {
                script {
                    echo "Building Docker image..."
                    sh 'docker build -t testnoteapp:latest -f Dockerfile .'
                    echo "Docker image build completed."
                }
            }
        }
    }
}

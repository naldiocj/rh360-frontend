node(){
    stage('Cloning Git') {
        checkout scm
    }

    stage('Install dependencies') {
        nodejs('nodejs') {
            sh 'npm install --legacy-peer-deps'
            echo "Modules installed"
        } 
    }

    stage('Build') {
        nodejs('nodejs') {
            sh 'npm run build'
            echo "Build completed"
        }
    }

    stage('Create frontend-coreui Directory') {
        sh 'mkdir -p frontend-coreui'
        sh 'cp -R dist/* frontend-coreui/'
        echo "frontend-coreui directory created"
    }

    stage('Package Build') {
        sh "tar -zcvf frontend-coreui.tar.gz frontend-coreui/"
    }

    stage('Artifacts Creation') {
        fingerprint 'frontend-coreui.tar.gz'
        archiveArtifacts 'frontend-coreui.tar.gz'
        echo "Artifacts created"
    }

    stage('Stash changes') {
        stash allowEmpty: true, includes: 'frontend-coreui.tar.gz', name: 'buildArtifacts'
    }
}

node('pna_front') {
    echo 'Unstash'
    unstash 'buildArtifacts'
    echo 'Artifacts copied'

    echo 'Copy'
    sh "yes | sudo cp -R frontend-coreui.tar.gz /var/www/html && cd /var/www/html && sudo tar -xvf frontend-coreui.tar.gz"
    echo 'Copy completed'
}

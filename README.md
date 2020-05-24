# kubernetes-lab2
<br/>
<ODPALANIE><br/>
1. kubectl create -f redis-service-clusterip.yml<br/>
2. kubectl create -f mybackend-deployment.yml<br/>
<br/>
<NOTATKI> 2 rodzaje - NodePort i ClusterIP <br/>
//https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/ <br/>
kubectl get service/deployment/pod <br/>
kubectl describe deployment/service/pod <br/>
kubectl delete service <service> <br/>
kubectl exec -ti dnsutils -- nslookup redis-service <br/>
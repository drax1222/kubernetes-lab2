# kubernetes-lab2
<br/>
<ODPALANIE><br/>
1. kubectl create -f redis-service-clusterip.yml
2. kubectl create -f mybackend-deployment.yml


<NOTATKI> 2 rodzaje - NodePort i ClusterIP <br/>
//https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/ <br/>
kubectl get service <br/>
kubectl describe deployment/service/pod <br/>
kubectl delete service <service> <br/>
kubectl exec -ti dnsutils -- nslookup redis-service <br/>
<h1>Nova mensagem pelo site</h1>
<p><strong>Nome:</strong> {{ $contactData['name'] }}</p>
<p><strong>E-mail:</strong> {{ $contactData['email'] }}</p>
<p><strong>Mensagem:</strong></p>
<p>{!! nl2br(e($contactData['message'])) !!}</p>

